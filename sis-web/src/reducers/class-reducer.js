import * as Types from '../actions/action'

export const classes = (state = [], { type, list, clazz }) => {
    switch (type) {
        case Types.SET_CLASSES:
            state = list;
            return [...state];
        case Types.ADD_CLASS:
            state.unshift(clazz);
            return [...state];
        default:
            return state;
    }
}