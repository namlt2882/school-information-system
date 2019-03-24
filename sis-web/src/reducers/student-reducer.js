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
        case Types.SET_STUDENT:
            index = state.findIndex(s => s.Id === student.Id);
            if (index !== -1) {
                state[index] = student;
            }
            return state;
        default:
            return state;
    }
}

export const student = (state = null, { type, student }) => {
    switch (type) {
        case Types.SET_STUDENT:
            state = { ...student };
            return state;
        case Types.DELETE_STUDENT:
            state = null;
            return state;
        default: return state;
    }
}
