import { combineReducers } from 'redux';
import { teachers } from './teacher-reducer'
import { subjects } from './subject-reducer'
import { exams } from './exam-reducer'
import { classes, clazz } from './class-reducer'

export const MainReducer = combineReducers({
    teachers,
    subjects,
    exams,
    classes, clazz
});