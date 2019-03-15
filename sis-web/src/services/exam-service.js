import { AuthRequest } from "../utils/request";

export const ExamService = {
    addExam: (exam) => {
        return AuthRequest.post('Examination', exam);
    },
    getAll: () => {
        return AuthRequest.get('Examination');
    }
}