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
    },
    update: (data) => {
        return AuthRequest.put('Student', data);
    },
    delete: (id) => {
        return AuthRequest.delete(`Student/${id}`);
    },
    setGraduated: (id) => {
        return AuthRequest.put(`Student/${id}/SetGraduated`);
    }
}