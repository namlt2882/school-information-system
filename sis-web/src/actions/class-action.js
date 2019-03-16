import * as Types from './action'

export const ClassAction = {
    setClasses: (list) => ({
        type: Types.SET_CLASSES,
        list
    }),
    addClass: (clazz) => ({
        type: Types.ADD_CLASS,
        clazz
    })
}