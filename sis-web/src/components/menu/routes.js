import React from 'react';
import NotFoundPage from './../error-pages/not-found-page'
import DashBoard from '../common-page/dashboard';
import ListUser from '../user-pages/list-user';
import ListSubject from '../subject-pages/list-subject';
import ListStudent from '../student-pages/list-student';
import ListTranscript from '../transcript-pages/list-transcript';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <DashBoard />
    },
    {
        path: '/user',
        exact: false,
        main: () => <ListUser />
    },
    {
        path: '/subject',
        exact: false,
        main: () => <ListSubject />
    },
    {
        path: '/student',
        exact: false,
        main: () => <ListStudent/>
    },
    {
        path: '/transcript',
        exact: false,
        main: () => <ListTranscript />
    },
    {
        path: '',
        exact: true,
        main: () => <NotFoundPage />
    }
];

export default routes;