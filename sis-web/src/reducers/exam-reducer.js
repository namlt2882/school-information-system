import * as Types from '../actions/action'

export const exams = (state = [], { type, list, exam }) => {
    switch (type) {
        case Types.SET_EXAMS:
            state = list;
            return [...state];
        case Types.ADD_EXAM:
            state.unshift(exam);
            return [...state];
        default:
            return state;
    }
}