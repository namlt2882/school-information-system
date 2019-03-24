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
    },
    removeSubjects: (classId, classSubjects) => {
        return AuthRequest.put('Class/RemoveSubject', {
            ClassId: classId,
            SubjectIds: classSubjects.map(cs => ({
                SubjectId: cs.subjectId,
                TeacherId: cs.teacherId
            }))
        })
    },
    get: (id) => {
        return AuthRequest.get(`Class/${id}`);
    },
    updateInfo: (id, data) => {
        return AuthRequest.put(`Class/${id}`, data);
    },
    getTeachingClass: (username) => {
        return AuthRequest.get(`Class/TeachingClass/${username}`);
    },
    addStudents: (data) => {
        return AuthRequest.post('Class/AddStudent', data);
    },
    removeStudent: (classId, studentId) => {
        return AuthRequest.put('Class/RemoveStudent', {
            ClassId: classId,
            StudentIds: [studentId]
        });
    },
    close: (classId) => {
        return AuthRequest.put(`Class/${classId}/Close`);
    }
}