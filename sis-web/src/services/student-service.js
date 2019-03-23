import { AuthRequest } from "../utils/request";

export const StudentService = {
    addStudent: (exam) => {
        return AuthRequest.post('Student', exam);
    },
    getAll: () => {
        return AuthRequest.get('Student');
    },
    getNoClassStudent: () => {
        return AuthRequest.get('Student/GetNoClassStudent');
    }
}