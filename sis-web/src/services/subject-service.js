import { AuthRequest } from "../utils/request";

export const SubjectService = {
    addSubject: (subject) => {
        return AuthRequest.post('Subject', subject);
    },
    getAll: () => {
        return AuthRequest.get('Subject');
    },
    update: (id, name) => {
        return AuthRequest.put('Subject', {
            Id: id,
            Name: name
        });
    }
}