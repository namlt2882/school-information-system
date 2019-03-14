import React from 'react';
import NotFoundPage from './../error-pages/not-found-page'
import DashBoard from '../common/dashboard';
import ListTeacher from '../teacher-pages/list-teacher';
import ListSubject from '../subject-pages/list-subject';
import ListStudent from '../student-pages/list-student';
import ListTranscript from '../transcript-pages/list-transcript';
import ListClass from '../class-pages/list-class';
import ListExam from '../exam-pages/list-exam';

const routes = [
    {
        path: '/',
        exact: true,
        main: ({ history }) => <DashBoard history={history} />
    },
    {
        path: '/teacher',
        exact: false,
        main: ({ history }) => <ListTeacher history={history} />
    },
    {
        path: '/subject',
        exact: false,
        main: ({ history }) => <ListSubject history={history} />
    },
    {
        path: '/student',
        exact: false,
        main: ({ history }) => <ListStudent history={history} />
    },
    {
        path: '/transcript',
        exact: false,
        main: () => <ListTranscript />
    },
    {
        path: '/class',
        exact: false,
        main: () => <ListClass />
    },
    {
        path: '/exam',
        exact: false,
        main: () => <ListExam />
    }
];

export default routes;