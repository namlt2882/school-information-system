import React, { Component } from 'react';
import './App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import routes from './components/menu/routes'
import MyMenu from './components/menu/my-menu'
import LoginPage from './components/common/login';
import { isLoggedIn } from './services/auth-service'
import NotFoundPage from './components/error-pages/not-found-page';

class App extends Component {
  render() {
    isLoggedIn(() => { }, () => {
      var url = window.location.href;
      var lastPart = url.substr(url.lastIndexOf('/') + 1);
      if (lastPart != 'login') {
        window.location.href = '/login';
      }
    })
    return (
      <Router>
        <Switch>
          <Route path='/login' exact={true} component={({ match, history }) => <LoginPage match={match} history={history} />} />
          {/* <Route path='' exact={false}> */}
          <div>
            <MyMenu />
            <div className="container">
              <div className="row">
                {this.privateContent(routes)}
              </div>
            </div>
          </div>
          {/* </Route> */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
  privateContent = (routes) => {
    var result = routes.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.main}
        />
      );
    });
    return result;
  }
}

export default App;
