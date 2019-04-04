import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './navBar';
import Permissions from './permissions';
import AddPermission from './addPermission';
import EditPermission from './editPermission';
import Roles from './roles';
import AddRole from './addRole';
import EditRole from './editRole';
import RolePermissions from './rolePermissions';
import AddRolePermissions from './addRolePermissions';
import Login from './login';
import Home from './home';
import NotFound from './notFound';

export default class MainComponent extends Component {
    render() {
        return (
            <div>
                <ToastContainer/>

                <NavBar />

                <div className="container">
                    <Switch>
                        <Route exact path="/permissions" render={() => <Permissions />} />
                        <Route exact path="/permissions/add" render={() => <AddPermission />} />
                        <Route exact path='/permission/edit' component={EditPermission} />
                        <Route exact path="/roles" render={() => <Roles />} />
                        <Route exact path="/roles/add" render={() => <AddRole />} />
                        <Route exact path='/role/edit' component={EditRole} />
                        <Route exact path='/role/permissions' component={RolePermissions} />
                        <Route exact path='/role/permissions/add' component={AddRolePermissions} />
                        <Route exact path="/login" render={() => <Login />} />
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