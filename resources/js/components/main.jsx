import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import NavBar from './navbar';
import Roles from './roles';
import Permissions from './permissions';
import EditPermission from './editpermission';
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
                        <Route path="/roles" component={Roles} />
                        <Route path="/permissions" component={Permissions} />
                        <Route path="/login" component={Login} />
                        <Route exact path="/permission/edit/:id" component={EditPermission}></Route>
                        <Route path="/not-found" component={NotFound} />
                        <Route path="/" exact component={Home} />
                        <Redirect to="not-found" />
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