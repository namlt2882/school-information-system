import * as Types from './action'

export const StudentAction = {
    setStudents: (list) => ({
        type: Types.SET_STUDENTS,
        list
    }),
    addStudent: (student) => ({
        type: Types.ADD_STUDENT,
        student
    })
}