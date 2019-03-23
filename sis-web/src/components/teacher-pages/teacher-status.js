import React from 'react';
import { getTeacherStatusColor, describeTeacherStatus } from './teacher-detail';
import { Label } from 'semantic-ui-react';

class TeacherStatus extends React.Component {
    render() {
        let status = this.props.status;
        return (<Label color={getTeacherStatusColor(status)}>{describeTeacherStatus(status)}</Label>);
    }
}

export default TeacherStatus;