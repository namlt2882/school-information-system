import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

class StudentStatus extends Component {
    render() {
        let status = this.props.status;
        return (<Label color={getStudentStatusColor(status)}>{describeStudentStatus(status)}</Label>);
    }
}

export const getStudentStatusColor = (status) => {
    let rs = 'gray'
    switch (status) {
        case 1:
            rs = 'green';
            break;
        case 2:
            rs = 'orange';
            break;
    }
    return rs;
}

export const describeStudentStatus = (status) => {
    let rs = ''
    switch (status) {
        case 1: rs = 'Đang học'; break;
        case 2: rs = 'Tốt nghiệp'; break;
    }
    return rs;
}

export default StudentStatus;
