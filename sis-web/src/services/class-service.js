import { AuthRequest } from "../utils/request";

export const ClassService = {
    addClass: (clazz) => {
        return AuthRequest.post('Class', clazz);
    },
    getAll: () => {
        return AuthRequest.get('Class');
    },
    addSubjects: (classId, classSubjects) => {
        return AuthRequest.post('Class/AddSubject', {
            ClassId: classId,
            SubjectIds: classSubjects.map(cs => ({
                SubjectId: cs.subjectId,
                TeacherId: cs.teacherId
            }))
        })
    }
}