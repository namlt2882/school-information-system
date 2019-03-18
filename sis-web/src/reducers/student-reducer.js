import * as Types from '../actions/action'

export const students = (state = [], { type, list, student }) => {
    switch (type) {
        case Types.SET_STUDENTS:
            state = list;
            return [...state];
        case Types.ADD_STUDENT:
            state.unshift(student);
            return [...state];
        default:
            return state;
    }
}