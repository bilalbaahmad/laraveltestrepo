import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import NavBar from './navBar';
import Roles from './roles';
import AddRole from './addRole';
import AddPermission from './addPermission';
import Permissions from './permissions';
import EditPermission from './editPermission';
import EditRole from './editRole';
import Login from './login';
import Home from './home';
import NotFound from './notFound';

export default class MainComponent extends Component {
    render() {
        return (
            <div>
                <NavBar />

                <div className="container">
                    <Switch>
                        <Route exact path="/roles" render={() => <Roles />} />
                        <Route exact path="/permissions" render={() => <Permissions />} />
                        <Route exact path="/login" render={() => <Login />} />
                        <Route exact path='/permission/edit/:id' render={() => <EditPermission />} />
                        <Route exact path='/role/edit/:id' render={() => <EditRole />} />
                        <Route exact path="/roles/add" render={() => <AddRole />} />
                        <Route exact path="/permissions/add" render={() => <AddPermission />} />
                        <Route exact path="/not-found" render={() => <NotFound />} />
                        <Route exact path="/" render={() => <Home />} />
                        <Redirect to="/not-found" />
                    </Switch>
                </div>
            </div>
        );
    }
}

if (document.getElementById('main_div')) {
    ReactDOM.render(
        <BrowserRouter>
            <MainComponent />
        </BrowserRouter>,
        document.getElementById("main_div")
    );
}