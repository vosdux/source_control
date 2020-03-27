import React from 'react';
import Storage from '../Storage';
import { Route, Redirect, Switch } from 'react-router-dom';

export const StorageRoutes = () => (
    <Switch>
        <Route
            path='/storage'
            exact
            render={(props) => <Storage {...props} />}
        />
        <Redirect to='/storage' />
    </Switch>
);