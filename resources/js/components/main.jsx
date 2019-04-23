import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/contextMenu.css';

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
import Explorer from './mainComponents/explorer';
import AddFolder from './fileExplorerComponents/addFolder';
import AddFile from './fileExplorerComponents/addFile';
import Login from './mainComponents/login';
import Logout from './mainComponents/logout';
import Register from './mainComponents/register';
import Home from './mainComponents/home';
import NotFound from './mainComponents/notFound';
import ProtectedRoute from './sharedComponents/protectedRoute';

const mystore = createStore(reducer);

export default class MainComponent extends Component {

    constructor(props) {
        super(props);
        this.rerenderParentCallback = this.rerenderParentCallback.bind(this);

        this.state = {
            permissions: []
        }
    }

    componentDidMount()
    {
        var token = '';
        if(localStorage.hasOwnProperty('access_token'))
        {
            token = localStorage.getItem('access_token');
        }

        if(token != '')
        {
            var header = {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'get',
                url: '/api/user/permissions',
                headers: header,

            }).then(response => {
                const permissions = response.data;
                if (response.data.status === 'error') {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                }
                else
                {
                    this.setState({ permissions })
                }
            });
        }
    }

    rerenderParentCallback() {
        this.forceUpdate();
    }

    render() {

        const permissions = this.state.permissions;

        return (
            <div>
                <ToastContainer/>

                <NavBar />

                <div className="container">
                    <Switch>
                        {/* <Route exact path="/permissions" render={() => <Permissions />} />*/}
                        {/*<Route exact path="/permissions/add" render={() => <AddPermission />} />*/}
                        {/*<Route exact path='/permission/edit' component={EditPermission} />*/}
                        {/*<Route exact path="/roles" render={() => <Roles />} />*/}
                        {/*<Route exact path="/roles/add" render={() => <AddRole />} />*/}
                        {/*<Route exact path='/role/edit' component={EditRole} />*/}
                        {/*<Route exact path='/role/permissions' component={RolePermissions} />*/}
                        {/*<Route exact path='/role/permissions/add' component={AddRolePermissions} />*/}
                        {/*<Route exact path="/users" render={() => <Users />} />*/}
                        {/*<Route exact path="/user/roles" component={UserRoles} />*/}
                        {/*<Route exact path="/user/permissions" component={UserPermissions} />*/}
                        {/*<Route exact path="/explorer" component={Explorer}/>*/}
                        {/*<Route exact path="/folder/add" component={AddFolder}/>*/}
                        {/*<Route exact path="/file/add" component={AddFile}/>*/}

                        <ProtectedRoute exact path="/permissions" permissions={permissions} name={'View Permissions'} component={Permissions} />
                        <ProtectedRoute exact path="/permissions/add" permissions={permissions} name={'Add Permission'} component={AddPermission} />
                        <ProtectedRoute exact path="/permission/edit" permissions={permissions} name={'Edit Permission'} component={EditPermission} />
                        <ProtectedRoute exact path="/roles" permissions={permissions} name={'View Roles'} component={Roles} />
                        <ProtectedRoute exact path="/roles/add" permissions={permissions} name={'Add Role'} component={AddRole} />
                        <ProtectedRoute exact path="/role/edit" permissions={permissions} name={'Edit Role'} component={EditRole} />
                        <ProtectedRoute exact path="/role/permissions" permissions={permissions} name={'View Role Permissions'} component={RolePermissions} />
                        <ProtectedRoute exact path="/role/permissions/add" permissions={permissions} name={'Add Role Permissions'} component={AddRolePermissions} />
                        <ProtectedRoute exact path="/users" permissions={permissions} name={'View Users'} component={Users} />
                        <ProtectedRoute exact path="/user/roles" permissions={permissions} name={'Manage User Roles'} component={UserRoles} />
                        <ProtectedRoute exact path="/user/permissions" permissions={permissions} name={'Manage User Permissions'} component={UserPermissions} />
                        <ProtectedRoute exact path="/explorer" permissions={permissions} name={'View Directory'} component={Explorer} />
                        <ProtectedRoute exact path="/folder/add" permissions={permissions} name={'Create Folder'} component={AddFolder} />
                        <ProtectedRoute exact path="/file/add" permissions={permissions} name={'Upload File'} component={AddFile} />


                        <Route exact path="/login" render={() => <Login rerenderParentCallback={this.rerenderParentCallback} />} />
                        <Route exact path="/logout" render={() => <Logout rerenderParentCallback={this.rerenderParentCallback} />} />
                        <Route exact path="/register" render={() => <Register />} />
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
        <Provider store={mystore}>
            <BrowserRouter>
                <MainComponent />
            </BrowserRouter>
        </Provider>,
        document.getElementById("main_div")
    );
}