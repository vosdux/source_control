import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import MainLayout from './components/MainLayout';
import { getRole } from './helpers/Utils';
import { StorageRoutes, SpecialistRoutes, AdminRoutes } from './components/Routes/';

class App extends Component {

  componentDidMount() {
    const data = localStorage.getItem('userData');
    console.log(data);
    if (data) {
      let parsedData = JSON.parse(data);
      if (parsedData.accessToken && parsedData.role) {
        console.log(parsedData)
        this.props.userLoginAction(true, parsedData.role);
      }
    }
  };

  render() {
    const { isAuthinticated, role } = this.props;
    console.log(isAuthinticated)
    return (
      <>
        {isAuthinticated ? <MainLayout>
          {getRole(role) === 'storage' ? <StorageRoutes /> : <SpecialistRoutes />}
        </MainLayout> : <AdminRoutes />}
      </>
    );

  }

};

const mapStateToProps = (state) => {
  const { isAuthinticated, role } = state
  return {
    isAuthinticated,
    role
  }
}

const mapDispatchToProps = {
  userLoginAction: actions.userLoginAction
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
