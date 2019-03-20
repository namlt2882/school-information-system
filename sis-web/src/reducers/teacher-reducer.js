
import * as Types from '../actions/action'

export const teachers = (state = [], { type, list, teacher }) => {
    switch (type) {
        case Types.SET_TEACHERS:
            state = list;
            return [...state];
        case Types.ADD_TEACHER:
            state.unshift(teacher);
            return [...state];
        default:
            return state;
    }
}