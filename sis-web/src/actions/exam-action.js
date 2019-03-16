import * as Types from './action'

export const ExamAction = {
    setExams: (list) => ({
        type: Types.SET_EXAMS,
        list
    }),
    addExam: (exam) => ({
        type: Types.ADD_EXAM,
        exam
    })
}