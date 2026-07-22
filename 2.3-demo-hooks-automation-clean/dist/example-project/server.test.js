/**
 * Tests for the Notes API server
 *
 * These tests call the exported route handlers directly so they work
 * in environments where opening sockets is blocked.
 */
import { default as app, createNote, deleteNote, getAllNotes, getNoteById, notes, updateNote, healthCheck, } from './server';
class MockResponse {
    statusCode = 200;
    body = undefined;
    status(code) {
        this.statusCode = code;
        return this;
    }
    json(payload) {
        this.body = payload;
        return this;
    }
    send(payload) {
        this.body = payload;
        return this;
    }
}
function createResponse() {
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
    describe('GET /', () => {
        it('should register a GET route as an alias for /notes', () => {
            const routeStack = app._router?.stack ?? [];
            const hasRootGetRoute = routeStack.some((layer) => {
                return layer.route?.path === '/' && layer.route.methods?.get === true;
            });
            expect(hasRootGetRoute).toBe(true);
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
            expect(response.body.id).toBeDefined();
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
