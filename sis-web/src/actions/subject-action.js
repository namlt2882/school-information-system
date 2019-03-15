import * as Types from './action'

export const SubjectAction = {
    setSubjects: (list) => ({
        type: Types.SET_SUBJECTS,
        list
    }),
    addSubject: (subject) => ({
        type: Types.ADD_SUBJECT,
        subject
    })
}