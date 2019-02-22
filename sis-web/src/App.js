import React, { Component } from 'react';
import './App.css';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import routes from './components/menu/routes'
import MyMenu from './components/menu/my-menu'
import LoginPage from './components/common/login';
import { isLoggedIn } from './services/auth-service'
import NotFoundPage from './components/error-pages/not-found-page';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' exact={true} component={LoginPage} />
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
    if (!isLoggedIn()) {
      return <Redirect to={{ pathname: '/login' }} />
    }
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
