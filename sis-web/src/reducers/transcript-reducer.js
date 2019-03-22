import * as Types from '../actions/action'

export const transcripts = (state = [], { type, list }) => {
    switch (type) {
        case Types.SET_TRANSCRIPTS:
            state = list;
        default:
            return state;
    }
}