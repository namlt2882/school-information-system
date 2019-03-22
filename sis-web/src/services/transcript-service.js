import { AuthRequest } from "../utils/request";

export const TranscriptService = {
    getStudentTranscript(classId, studentId) {
        return AuthRequest.get(`Transcript?StudentId=${studentId}&ClassId=${classId}`);
    },
    getClassSubjectTranscript(classSubjectId) {
        return AuthRequest.get(`Transcript/ClassSubject/${classSubjectId}`);
    },
    updateTranscripts(transcripts) {
        return AuthRequest.put('Transcript', transcripts);
    }
}