import { AuthRequest } from "../utils/request";

export const TranscriptService = {
    getStudentTranscript(classId, studentId) {
        return AuthRequest.get(`Transcript?StudentId=${studentId}&ClassId=${classId}`);
    }
}