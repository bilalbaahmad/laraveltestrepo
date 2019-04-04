import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './mainComponents/navBar';
import Permissions from './mainComponents/permissions';
import AddPermission from './rolePermissionComponents/addPermission';
import EditPermission from './rolePermissionComponents/editPermission';
import Roles from './mainComponents/roles';
import AddRole from './rolePermissionComponents/addRole';
import EditRole from './rolePermissionComponents/editRole';
import RolePermissions from './rolePermissionComponents/rolePermissions';
import AddRolePermissions from './rolePermissionComponents/addRolePermissions';
import Users from './mainComponents/users';
import UserRoles from './userComponents/userRoles';
import UserPermissions from './userComponents/userPermissions';
import Login from './mainComponents/login';
import Home from './mainComponents/home';
import NotFound from './mainComponents/notFound';

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
                        <Route exact path="/users" render={() => <Users />} />
                        <Route exact path="/user/roles" component={UserRoles} />
                        <Route exact path="/user/permissions" component={UserPermissions} />
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