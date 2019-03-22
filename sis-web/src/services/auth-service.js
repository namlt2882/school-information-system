import { Request, AuthRequest } from './../utils/request'

export const isLoggedIn = (yes = () => { }, no = () => { }) => {
    let token = localStorage.getItem('access_token');
    let result = true;
    if (token == undefined) {
        removeJwt();
        no();
    } else {
        yes();
        // let res = AuthService.getUserInfo()
        //     .then(res => {
        //         console.log(res);
        //         yes();
        //     }).catch((err) => {
        //         result = false;
        //         if (err.response) {
        //             console.log(err.response.status);
        //         }
        //         removeJwt();
        //         no();
        //     });
    }
}

const removeJwt = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
}

export const AuthService = {
    login: (username, password) => {
        return Request().post('auth/Login', {
            'username': username,
            'password': password
        }).then(res => {
            let user = res.data.user;
            let token = res.data.token;
            let role = user.Role;
            let username = user.Username.trim();
            let name = user.Name;
            localStorage.setItem('access_token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            localStorage.setItem('name', name);
        });;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        window.location.href = '/login'
    },
    getUserInfo: () => {
        return AuthRequest.get('auth/Info');
    },
    isManager: () => {
        return localStorage.getItem('role') == 1;
    },
    isTeacher: () => {
        return localStorage.getItem('role') == 2;
    },
    getUsername: () => {
        return localStorage.getItem('username');
    }
}