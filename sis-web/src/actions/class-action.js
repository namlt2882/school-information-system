import * as Types from './action'

export const ClassAction = {
    setClasses: (list) => ({
        type: Types.SET_CLASSES,
        list
    }),
    addClass: (clazz) => ({
        type: Types.ADD_CLASS,
        clazz
    }),
    setClass: (clazz) => ({
        type: Types.SET_CLASS,
        clazz
    })
}