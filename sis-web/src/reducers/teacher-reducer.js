
import * as Types from '../actions/action'

export const teachers = (state = [], { type, list, teacher }) => {
    let index = -1;
    switch (type) {
        case Types.SET_TEACHERS:
            state = list;
            return [...state];
        case Types.ADD_TEACHER:
            state.unshift(teacher);
            return [...state];
        case Types.SET_TEACHER:
            index = state.findIndex(t => t.Username.trim() === teacher.Username.trim());
            if (index !== -1) {
                state[index] = teacher;
            }
            return state;
        case Types.DELETE_TEACHER:
            if (teacher) {
                index = state.findIndex(t => t.Username.trim() === teacher.Username.trim());
                if (index !== -1) {
                    state.splice(index, 1);
                }
            }
            return [...state];
        default:
            return state;
    }
}

export const teacher = (state = null, { type, teacher }) => {
    switch (type) {
        case Types.SET_TEACHER:
            state = teacher;
            return { ...state };
        case Types.DELETE_TEACHER:
            state = null;
            return state;
        default:
            return state;
    }

}