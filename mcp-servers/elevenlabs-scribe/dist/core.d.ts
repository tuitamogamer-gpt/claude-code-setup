/**
 * Shared transcription helpers used by both the single and batch tools:
 * rendering output formats, building structured content, deriving file names,
 * and writing server-side exported formats (docx/pdf/srt/...) to disk.
 */
import type { AdditionalFormat, TranscriptionResponse } from "./types.js";
export type ResponseFormat = "text" | "markdown" | "json" | "srt";
export declare const EXT_BY_FORMAT: Record<ResponseFormat, string>;
export declare function resolvePath(p: string): string;
/** Directory to write outputs into: the source file's directory, or cwd for URLs. */
export declare function defaultDir(filePath?: string): string;
/** Base file name (without extension) derived from a local path or a URL. */
export declare function sourceBaseName(filePath?: string, sourceUrl?: string): string;
/** Reserve a unique path; if already taken, insert a ".transcript" infix before the extension. */
export declare function uniquePath(desired: string, taken: Set<string>): string;
/** Render the API response into the requested output format. */
export declare function renderBody(resp: TranscriptionResponse, format: ResponseFormat, modelId: string): string;
/** Build the machine-readable structured content (without saved_to / exported_files). */
export declare function buildStructured(resp: TranscriptionResponse, modelId: string, format: ResponseFormat): Record<string, unknown>;
/** Write each server-side exported format to `<outputDir>/<baseName>.<ext>` and return the paths. */
export declare function saveExportedFormats(formats: AdditionalFormat[] | null | undefined, outputDir: string, baseName: string, taken: Set<string>): Promise<string[]>;
//# sourceMappingURL=core.d.ts.map