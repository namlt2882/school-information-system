import * as Types from './action'

export const TeacherAction = {
    setTeachers: (list) => ({
        type: Types.SET_TEACHERS,
        list
    }),
    addTeacher: (teacher) => ({
        type: Types.ADD_TEACHER,
        teacher
    })
}