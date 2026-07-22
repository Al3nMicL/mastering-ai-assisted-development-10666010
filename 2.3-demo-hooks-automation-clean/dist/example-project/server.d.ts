/**
 * Chapter 2.3: Custom Slash Commands & Workflow Automation Demo (Clean)
 *
 * A simple Express server — the starting point before adding
 * custom slash commands. No .claude/ directory yet.
 *
 * This server provides basic CRUD operations for notes.
 * During the demo, you'll create commands like:
 * - /verify  — run tests + lint and get a summary
 * - /review  — structured code review with severity levels
 * - /scaffold — generate a new feature module with tests
 */
declare const app: import("express-serve-static-core").Express;
interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}
export interface NoteRequest {
    params?: {
        id?: string;
    };
    body?: {
        title?: string;
        content?: string;
    };
}
export interface NoteResponse {
    status(code: number): NoteResponse;
    json(payload: unknown): NoteResponse;
    send(payload?: unknown): NoteResponse;
}
export declare const notes: Map<string, Note>;
export declare function getAllNotes(_req: NoteRequest, res: NoteResponse): void;
export declare function getNoteById(req: NoteRequest, res: NoteResponse): void;
export declare function createNote(req: NoteRequest, res: NoteResponse): void;
export declare function updateNote(req: NoteRequest, res: NoteResponse): void;
export declare function deleteNote(req: NoteRequest, res: NoteResponse): void;
export declare function healthCheck(_req: NoteRequest, res: NoteResponse): void;
export default app;
