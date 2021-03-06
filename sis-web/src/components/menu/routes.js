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
import { AuthService } from '../../services/auth-service';
import ListClassTeacherView from '../class-pages/list-class-teacher-view';
import PersonalPage from '../common/personal-page';

const routes = [
    {
        path: '/',
        exact: true,
        main: ({ history }) => {
            if (AuthService.isTeacher()) {
                return <ListClassTeacherView history={history} />
            }
            return <ListClass history={history} />
        }
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
        main: ({ history }) => {
            if (AuthService.isTeacher()) {
                return <ListClassTeacherView history={history} />
            }
            return <ListClass history={history} />
        }
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
    },
    {
        path: '/personal-info',
        exact: false,
        main: ({ match, history }) => <PersonalPage match={match} history={history}/>
    },
];

export default routes;