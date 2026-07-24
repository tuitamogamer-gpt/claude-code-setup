/**
 * Zod input schemas for the MCP tools.
 */
import { z } from "zod";
export declare const RESPONSE_FORMATS: readonly ["text", "markdown", "json", "srt"];
export declare const TIMESTAMP_GRANULARITIES: readonly ["none", "word", "character"];
export declare const EXPORT_FORMATS: readonly ["docx", "pdf", "html", "srt", "txt", "segmented_json"];
export declare const TranscribeInputSchema: z.ZodObject<{
    file_path: z.ZodOptional<z.ZodString>;
    source_url: z.ZodOptional<z.ZodString>;
    model_id: z.ZodDefault<z.ZodString>;
    language_code: z.ZodDefault<z.ZodString>;
    script: z.ZodDefault<z.ZodEnum<["latin", "cyrillic"]>>;
    diarize: z.ZodDefault<z.ZodBoolean>;
    num_speakers: z.ZodOptional<z.ZodNumber>;
    tag_audio_events: z.ZodDefault<z.ZodBoolean>;
    timestamps_granularity: z.ZodDefault<z.ZodEnum<["none", "word", "character"]>>;
    temperature: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    response_format: z.ZodDefault<z.ZodEnum<["text", "markdown", "json", "srt"]>>;
    save_to_path: z.ZodOptional<z.ZodString>;
    export_formats: z.ZodOptional<z.ZodArray<z.ZodEnum<["docx", "pdf", "html", "srt", "txt", "segmented_json"]>, "many">>;
    output_dir: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model_id: string;
    language_code: string;
    diarize: boolean;
    tag_audio_events: boolean;
    timestamps_granularity: "word" | "none" | "character";
    script: "latin" | "cyrillic";
    response_format: "text" | "markdown" | "json" | "srt";
    source_url?: string | undefined;
    num_speakers?: number | undefined;
    temperature?: number | undefined;
    seed?: number | undefined;
    file_path?: string | undefined;
    save_to_path?: string | undefined;
    export_formats?: ("srt" | "txt" | "docx" | "pdf" | "html" | "segmented_json")[] | undefined;
    output_dir?: string | undefined;
}, {
    model_id?: string | undefined;
    language_code?: string | undefined;
    source_url?: string | undefined;
    diarize?: boolean | undefined;
    num_speakers?: number | undefined;
    tag_audio_events?: boolean | undefined;
    timestamps_granularity?: "word" | "none" | "character" | undefined;
    temperature?: number | undefined;
    seed?: number | undefined;
    file_path?: string | undefined;
    script?: "latin" | "cyrillic" | undefined;
    response_format?: "text" | "markdown" | "json" | "srt" | undefined;
    save_to_path?: string | undefined;
    export_formats?: ("srt" | "txt" | "docx" | "pdf" | "html" | "segmented_json")[] | undefined;
    output_dir?: string | undefined;
}>;
export type TranscribeInput = z.infer<typeof TranscribeInputSchema>;
export declare const BatchTranscribeInputSchema: z.ZodObject<{
    file_paths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    source_urls: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    model_id: z.ZodDefault<z.ZodString>;
    language_code: z.ZodDefault<z.ZodString>;
    script: z.ZodDefault<z.ZodEnum<["latin", "cyrillic"]>>;
    diarize: z.ZodDefault<z.ZodBoolean>;
    num_speakers: z.ZodOptional<z.ZodNumber>;
    tag_audio_events: z.ZodDefault<z.ZodBoolean>;
    timestamps_granularity: z.ZodDefault<z.ZodEnum<["none", "word", "character"]>>;
    response_format: z.ZodDefault<z.ZodEnum<["text", "markdown", "json", "srt"]>>;
    export_formats: z.ZodOptional<z.ZodArray<z.ZodEnum<["docx", "pdf", "html", "srt", "txt", "segmented_json"]>, "many">>;
    output_dir: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model_id: string;
    language_code: string;
    diarize: boolean;
    tag_audio_events: boolean;
    timestamps_granularity: "word" | "none" | "character";
    script: "latin" | "cyrillic";
    response_format: "text" | "markdown" | "json" | "srt";
    num_speakers?: number | undefined;
    export_formats?: ("srt" | "txt" | "docx" | "pdf" | "html" | "segmented_json")[] | undefined;
    output_dir?: string | undefined;
    file_paths?: string[] | undefined;
    source_urls?: string[] | undefined;
}, {
    model_id?: string | undefined;
    language_code?: string | undefined;
    diarize?: boolean | undefined;
    num_speakers?: number | undefined;
    tag_audio_events?: boolean | undefined;
    timestamps_granularity?: "word" | "none" | "character" | undefined;
    script?: "latin" | "cyrillic" | undefined;
    response_format?: "text" | "markdown" | "json" | "srt" | undefined;
    export_formats?: ("srt" | "txt" | "docx" | "pdf" | "html" | "segmented_json")[] | undefined;
    output_dir?: string | undefined;
    file_paths?: string[] | undefined;
    source_urls?: string[] | undefined;
}>;
export type BatchTranscribeInput = z.infer<typeof BatchTranscribeInputSchema>;
//# sourceMappingURL=schemas.d.ts.map