export const isLoggedIn = () => {
    var token = localStorage.getItem('access_token');
    if (token == undefined) {
        return false;
    } else {
        return true;
    }
}