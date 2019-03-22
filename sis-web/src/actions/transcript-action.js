import * as Types from './action'

export const TranscriptAction = {
    setTranscripts: (list) => ({
        type: Types.SET_TRANSCRIPTS,
        list
    })
}