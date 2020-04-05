import React, { Component } from 'react';
import Squads from '../../modules/Squads';
import Storage from '../Storage';
import Norms from '../Norms';
import Property from '../Property';
import Archive from '../Archive';
import PeopleCard from '../../modules/PeopleCard';
import Peoples from '../../modules/Peoples';
import Stations from '../../modules/Stations';
import { Route, Redirect, Switch } from 'react-router-dom';

export const SpecialistRoutes = (props) => {console.log(props); return (<Switch>
    <Route
        path='/squads'
        exact
        component={Squads}
    />
    <Route
        path='/squads/:id/:stationId/:peopleId'
        component={PeopleCard}
    />
    <Route
        path='/squads/:id/:stationId'
        component={Peoples}
    />
    <Route
        path='/squads/:id'
        component={Stations}
    />
    <Route
        path='/property'
        component={Property}
    />
    <Route
        path='/archive'
        component={Archive}
    />
    {/* <Route
        to='/archive/:id'
        render={(props) => <PeopleCard archived={true} {...props} />}
    /> */}
    <Route
        path='/norms'
        component={Norms}
    />
    <Route
        path='/storage'
        component={Storage}
    />
    <Route
        path='/property'
        component={Property}
    />
    <Redirect to='/squads' />
</Switch>)};