import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import MainLayout from './components/MainLayout';
import { getRole } from './helpers/Utils';
import { StorageRoutes, SpecialistRoutes, AuthRoutes } from './components/Routes/';

class App extends Component {

  state = {
    isAuthinticated: false
  }

  componentWillMount() {
    const data = localStorage.getItem('userData');
    if (data) {
      let parsedData = JSON.parse(data);
      if (parsedData.accessToken && parsedData.role) {
        this.props.userLoginAction(parsedData.role)
        this.setState({ isAuthinticated: true })
      }
    }
  };

  loginHandler = (accessToken, refreshToken, role, expiredIn) => {
    localStorage.setItem('userData', JSON.stringify({
      accessToken,
      refreshToken,
      role,
      expiredIn
    }));
    this.props.userLoginAction(role);
    this.setState({ isAuthinticated: true });
  }

  logoutHandler = () => {
    localStorage.clear();
    this.setState({ isAuthinticated: false });
  };

  render() {
    const { role } = this.props;
    const { isAuthinticated } = this.state;
    console.log(this.props)
    return (
      <>
        {isAuthinticated ? <MainLayout logoutHandler={this.logoutHandler} location={this.props.location}>
          {getRole(role) === 'storage' ? <StorageRoutes /> : <SpecialistRoutes />}
        </MainLayout> : <AuthRoutes onSuccess={this.loginHandler} />}
      </>
    );

  }

};

const mapStateToProps = (state) => {
  const { role } = state;
  return { role };
};

const mapDispatchToProps = {
  userLoginAction: actions.userLoginAction
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
