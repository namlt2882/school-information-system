import React from 'react';
import NotFoundPage from './../error-pages/not-found-page'
import DashBoard from '../common/dashboard';
import ListTeacher from '../teacher-pages/list-teacher';
import ListSubject from '../subject-pages/list-subject';
import ListStudent from '../student-pages/list-student';
import StudentTranscript from '../transcript-pages/student-transcript';
import ListClass from '../class-pages/list-class';
import ListExam from '../exam-pages/list-exam';
import ClassDetail from '../class-pages/class-detail';

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
        path: '/transcript/:classId/:studentId/view',
        exact: false,
        main: ({ match, history }) => <StudentTranscript
            key={`${match.params.classId}-${match.params.studentId}`} match={match} history={history} />
    },
    {
        path: '/class',
        exact: true,
        main: ({ history }) => <ListClass history={history} />
    },
    {
        path: '/class/:id/view',
        exact: true,
        main: ({ match, history }) => <ClassDetail match={match} history={history} />
    },
    {
        path: '/exam',
        exact: false,
        main: () => <ListExam />
    }
];

export default routes;