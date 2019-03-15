import * as Types from '../actions/action'

export const subjects = (state = [], { type, list, subject }) => {
    switch (type) {
        case Types.SET_SUBJECTS:
            state = list;
            return [...state];
        case Types.ADD_SUBJECT:
            state.unshift(subject);
            return [...state];
        default:
            return state;
    }
}