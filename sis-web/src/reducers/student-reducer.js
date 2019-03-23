import * as Types from '../actions/action'

export const students = (state = [], { type, list, student }) => {
    let index = -1;
    switch (type) {
        case Types.SET_STUDENTS:
            state = list;
            return [...state];
        case Types.ADD_STUDENT:
            state.unshift(student);
            return [...state];
        case Types.DELETE_STUDENT:
            index = state.findIndex(s => s.Id === student.Id);
            if (index !== -1) {
                state.splice(index, 1);
            }
            return state;
        default:
            return state;
    }
}