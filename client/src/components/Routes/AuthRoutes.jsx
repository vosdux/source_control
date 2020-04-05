import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from '../../modules/Auth/Auth';

export const AuthRoutes = ({ onSuccess }) => (
    <Switch>
        <Route
            path='/login'
            exact
            render={(props) => <Auth {...props} onSuccess={onSuccess} />}
        />
        <Redirect to='/login' />
    </Switch>
);
