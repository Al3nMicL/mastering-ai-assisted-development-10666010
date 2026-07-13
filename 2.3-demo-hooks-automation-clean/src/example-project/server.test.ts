/**
 * Tests for the Notes API server
 *
 * These tests call the exported route handlers directly so they work
 * in environments where opening sockets is blocked.
 */

import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  notes,
  updateNote,
  healthCheck,
} from './server';

type ResponseBody = unknown;

class MockResponse {
  public statusCode = 200;
  public body: ResponseBody = undefined;

  public status(code: number): this {
    this.statusCode = code;
    return this;
  }

  public json(payload: ResponseBody): this {
    this.body = payload;
    return this;
  }

  public send(payload?: ResponseBody): this {
    this.body = payload;
    return this;
  }
}

function createResponse(): MockResponse {
  return new MockResponse();
}

describe('Notes API', () => {
  beforeEach(() => {
    notes.clear();
  });

  describe('GET /health', () => {
    it('should return healthy status', () => {
      const response = createResponse();
      healthCheck({}, response);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ status: 'healthy' });
    });
  });

  describe('GET /notes', () => {
    it('should return an empty array initially', () => {
      const response = createResponse();
      getAllNotes({}, response);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /notes', () => {
    it('should create a new note with valid input', () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note',
      };

      const response = createResponse();
      createNote({ body: noteData }, response);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(noteData);
      expect((response.body as { id?: string }).id).toBeDefined();
    });

    it('should return 400 if title is missing', () => {
      const noteData = { content: 'Missing title' };

      const response = createResponse();
      createNote({ body: noteData }, response);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Title and content are required' });
    });

    it('should return 400 if content is missing', () => {
      const noteData = { title: 'Missing content' };

      const response = createResponse();
      createNote({ body: noteData }, response);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Title and content are required' });
    });
  });

  describe('GET /notes/:id', () => {
    it('should return 404 for non-existent note', () => {
      const response = createResponse();
      getNoteById({ params: { id: 'nonexistent' } }, response);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('PUT /notes/:id', () => {
    it('should return 404 when updating non-existent note', () => {
      const updateData = { title: 'Updated' };

      const response = createResponse();
      updateNote({ params: { id: 'nonexistent' }, body: updateData }, response);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should return 404 when deleting non-existent note', () => {
      const response = createResponse();
      deleteNote({ params: { id: 'nonexistent' } }, response);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: 'Note not found' });
    });
  });
});
