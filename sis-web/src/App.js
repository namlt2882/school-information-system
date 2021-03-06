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
      <Router style={{ minHeight: '100%' }}>
        <Switch>
          <Route path='/login' exact={true} component={({ match, history }) => <LoginPage match={match} history={history} />} />
          {/* <Route path='' exact={false}> */}
          <div>
            <MyMenu />
            <div className="container arial" style={{
              padding: '20px',
              zIndex: '0',
              backgroundColor: 'white',
              minHeight: '85%',
              borderRadius: '5px',
              border: '1px solid #dddfe2'
            }}>
              <div className='row justify-content-center align-self-center'>
                <div className='col-sm-12 row'>
                  {this.privateContent(routes)}
                </div>
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
