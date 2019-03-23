import { AuthRequest } from "../utils/request";

export const TeacherService = {
    addTeacher: (teacher) => {
        return AuthRequest.post('User', teacher);
    },
    getAll: () => {
        return AuthRequest.get('User');
    },
    updateTeacherInfo: (username, data) => {
        return AuthRequest.put(`User/${username}`, data);
    },
    ban: (username) => {
        return AuthRequest.put(`User/${username}/Ban`);
    },
    delete: (username) => {
        return AuthRequest.delete(`User/${username}`);
    },
    activate: (username) => {
        return AuthRequest.put(`User/${username}/Activate`);
    },
    changePassword: (username, password) => {
        return AuthRequest.put(`User/${username}/SetPassword`, {
            Password: password
        });
    }
}