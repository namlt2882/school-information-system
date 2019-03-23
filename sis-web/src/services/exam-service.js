import { AuthRequest } from "../utils/request";

export const ExamService = {
    addExam: (exam) => {
        return AuthRequest.post('Examination', exam);
    },
    getAll: () => {
        return AuthRequest.get('Examination');
    },
    update: (id, name, percentRate) => {
        return AuthRequest.put('Examination', {
            Id: id,
            Name: name,
            PercentRate: percentRate
        });
    }
}