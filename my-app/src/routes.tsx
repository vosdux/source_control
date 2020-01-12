import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Auth } from './modules/Auth';
import { Page } from './modules/Page';

export const useRouter = (isAuthinticated: boolean): JSX.Element => {
    if (isAuthinticated) {
        return (
            <Switch>
                <Route to="/" exact >
                    <Page />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }

    return (
        <Switch>
            <Route to="/login" exact>
                <Auth />
            </Route>
            <Redirect to="/login" />
        </Switch>
    );
}