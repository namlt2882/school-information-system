import { AuthRequest } from "../utils/request";

export const TeacherService = {
    addTeacher: (teacher) => {
        return AuthRequest.post('User', teacher);
    },
    getAll: () => {
        return AuthRequest.get('User');
    }
}