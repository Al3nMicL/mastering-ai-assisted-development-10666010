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

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory storage for demo
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

export const notes: Map<string, Note> = new Map();

export function getAllNotes(_req: NoteRequest, res: NoteResponse): void {
  try {
    const noteList = Array.from(notes.values());
    res.json(noteList);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
}

export function getNoteById(req: NoteRequest, res: NoteResponse): void {
  try {
    const { id } = req.params ?? {};
    const note = id !== undefined ? notes.get(id) : undefined;

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
}

export function createNote(req: NoteRequest, res: NoteResponse): void {
  try {
    const { title, content } = req.body ?? {};

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const id = Date.now().toString();
    const note: Note = {
      id,
      title,
      content,
      createdAt: new Date(),
    };

    notes.set(id, note);
    res.status(201).json(note);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
}

export function updateNote(req: NoteRequest, res: NoteResponse): void {
  try {
    const { id } = req.params ?? {};
    const { title, content } = req.body ?? {};

    if (id === undefined) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const note = notes.get(id);
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    if (title) note.title = title;
    if (content) note.content = content;

    notes.set(id, note);
    res.json(note);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
}

export function deleteNote(req: NoteRequest, res: NoteResponse): void {
  try {
    const { id } = req.params ?? {};

    if (id === undefined || !notes.has(id)) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    notes.delete(id);
    res.status(204).send();
  } catch (_error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
}

export function healthCheck(_req: NoteRequest, res: NoteResponse): void {
  res.json({ status: 'healthy' });
}

// Routes

/**
 * GET /
 * Alias for retrieving all notes
 */
app.get('/', (req, res) => {
  getAllNotes(req, res);
});

/**
 * GET /notes
 * Retrieve all notes
 */
app.get('/notes', (req, res) => {
  getAllNotes(req, res);
});

/**
 * GET /notes/:id
 * Retrieve a specific note by ID
 */
app.get('/notes/:id', (req, res) => {
  getNoteById(req, res);
});

/**
 * POST /notes
 * Create a new note
 */
app.post('/notes', (req, res) => {
  createNote(req, res);
});

/**
 * PUT /notes/:id
 * Update an existing note
 */
app.put('/notes/:id', (req, res) => {
  updateNote(req, res);
});

/**
 * DELETE /notes/:id
 * Delete a note
 */
app.delete('/notes/:id', (req, res) => {
  deleteNote(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  healthCheck(req, res);
});

// Start server only outside test runs so Jest can import the app safely.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Notes API running on http://localhost:${PORT}`);
  });
}

export default app;
