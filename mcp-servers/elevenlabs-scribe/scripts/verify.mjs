#!/usr/bin/env node
/**
 * End-to-end verification for the ElevenLabs Scribe MCP server.
 *
 * Spawns the built server (dist/index.js) over stdio, performs the MCP handshake,
 * checks the connection, and runs a real transcription against an audio file.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key node scripts/verify.mjs [audioPathOrUrl]
 *
 * Defaults to transcribing samples/hr-test.wav. The API key stays in your shell —
 * it is never written to disk or printed.
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const serverPath = join(projectRoot, "dist", "index.js");

if (!process.env.ELEVENLABS_API_KEY) {
  console.error("ERROR: set ELEVENLABS_API_KEY first, e.g.:\n  ELEVENLABS_API_KEY=your_key node scripts/verify.mjs");
  process.exit(1);
}

const target = process.argv[2] || join(projectRoot, "samples", "hr-test.wav");
const isUrl = /^https?:\/\//i.test(target);

const child = spawn("node", [serverPath], { stdio: ["pipe", "pipe", "pipe"] });

let buf = "";
const pending = new Map();
child.stdout.on("data", (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id != null && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});
child.stderr.on("data", (d) => process.stderr.write(d));

let nextId = 1;
function request(method, params) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}
function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

const fmt = (r) => r?.result?.content?.[0]?.text ?? JSON.stringify(r?.error ?? r);

try {
  await request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "verify", version: "1.0.0" },
  });
  notify("notifications/initialized", {});

  console.log("→ check_connection ...");
  const conn = await request("tools/call", {
    name: "elevenlabs_check_connection",
    arguments: {},
  });
  console.log(fmt(conn), "\n");

  console.log(`→ transcribe ${isUrl ? "(url) " : ""}${target} ...`);
  const args = isUrl ? { source_url: target } : { file_path: target };
  const res = await request("tools/call", {
    name: "elevenlabs_transcribe_audio",
    arguments: { ...args, response_format: "markdown" },
  });
  console.log(fmt(res));
  if (res?.result?.structuredContent) {
    console.log("\nstructured:", JSON.stringify(res.result.structuredContent, null, 2));
  }
  console.log(res?.result?.isError ? "\n❌ Transcription returned an error (see above)." : "\n✅ End-to-end OK.");
} finally {
  child.stdin.end();
  child.kill();
}
