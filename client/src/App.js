import React, { Component } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Squads from './modules/Squads';
import Peoples from './modules/Peoples';
import Stations from './modules/Stations';
import SquadForm from './components/AdminForms/SquadForm';
import * as actions from './store/actions';
import Auth from './modules/Auth/Auth';
import MainLayout from './components/MainLayout';
import PeopleCard from './modules/PeopleCard';


class App extends Component {
  state = {
    authRoutes: [
      {
        to: "/:scope(squads)",
        component: Squads
      },
      {
        to: "/:scope(squads)/:id",
        component: Stations
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
      if (parsedData.accessToken && parsedData.role) {
        console.log(parsedData)
        this.props.userLoginAction(true, parsedData.role);
      }
    }
  }

  render() {
    const { isAuthinticated } = this.props;
    return (
      <>
        {isAuthinticated ? <MainLayout>
          <Switch>
            <Route
              path='/'
              exact
              render={(props) => <Squads {...props} />}
            />
            <Route
              path='/:id/:stationId/:peopleId'
              render={(props) => <PeopleCard {...props} />}
            />
            <Route
              path='/:id/:stationId'
              render={(props) => <Peoples {...props} />}
            />
            <Route
              path='/:id'
              render={(props) => <Stations {...props} />}
            />
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
      </>
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
