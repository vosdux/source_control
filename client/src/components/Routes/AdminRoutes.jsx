import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from '../../modules/Auth/Auth';

export const AdminRoutes = () => (
    <Switch>
        <Route
            path='/login'
            exact
            render={(props) => <Auth {...props} />}
        />
        <Redirect to='/login' />
    </Switch>
);
