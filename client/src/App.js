import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Page } from './modules/Page';
import * as actions from './store/actions';
import Auth from './modules/Auth/Auth';
import MainLayout from './components/MainLayout';

class App extends Component {
  state = {
    authRoutes: [
      {
        to: "/",
        exact: true,
        component: Page
      }
    ],
    nonAuthRoutes: [
      {
        to: '/login',
        exact: true,
        component: Auth
      }
    ]
  }

  componentDidMount() {
    const data = localStorage.getItem('userData');
    console.log(data);
    if (data) {
      let parsedData = JSON.parse(data);
      if (parsedData.accessToken) {
        console.log(parsedData)
        this.props.userLoginAction(true);
      }
    }
  }

  render() {
    console.log(this.props);
    const { isAuthinticated } = this.props;
    return (
      <BrowserRouter>
        {isAuthinticated ? <MainLayout>
          <Switch>
            {this.state.authRoutes.map((route, i) =>
              <Route
                key={'route' + i}
                to={route.to}
                render={props => {
                  return <route.component {...props} {...route} />
                }}
                other={route}
              />)}
            <Redirect to='/' />
          </Switch>
        </MainLayout> : <Switch>
          {this.state.nonAuthRoutes.map((route, i) =>
                <Route
                  key={'route' + i}
                  to={route.to}
                  render={props => {
                    return <route.component {...props} {...route} />
                  }}
                  other={route}
                />)}
                <Redirect to='/login' />
        </Switch>}


      </BrowserRouter>
    );

  }

};

const mapStateToProps = (state) => {
  const { isAuthinticated } = state
  return {
    isAuthinticated
  }
}

const mapDispatchToProps = {
  userLoginAction: actions.userLoginAction
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
