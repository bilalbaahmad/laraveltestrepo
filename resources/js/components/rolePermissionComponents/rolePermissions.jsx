import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from 'react-loading-spinkit';

export default class RolePermissions extends Component
{
    constructor(props)
    {
        super(props);

        this.state={
            permissions:[],
            role_id: this.props.location.role_id,
            role_name: this.props.location.role_name,
            loading: true,
        }
    }

    componentDidMount()
    {
        var token = '';
        if(localStorage.hasOwnProperty('access_token'))
        {
            token = localStorage.getItem('access_token');
        }

        if(token == '')
        {
            toast.error("You are not logged in !", {  autoClose: 3000 });
        }
        else
        {
            const role_id = this.state.role_id;

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'get',
                url: '/api/role/'+role_id+'/permissions',
                headers: header,

            }).then(response => {
                const resp = response.data;
                console.log(resp);
                if (response.data.status === 'error')
                {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                }
                else
                {
                    if (resp == 'Access Denied')
                    {
                        toast.warning(resp, {autoClose: 3000});
                    }
                    else
                    {
                        this.setState({permissions:response.data, loading: false});

                        $(this.refs.role_permissions_table).DataTable({
                            paginate: true,
                            scrollCollapse: true,
                            ordering: true,
                        });
                    }
                }
            });
        }
    }

    onDelete(permission_id,role_id)
    {
        var token = '';
        if(localStorage.hasOwnProperty('access_token'))
        {
            token = localStorage.getItem('access_token');
        }

        if(token == '')
        {
            toast.error("You are not logged in !", {  autoClose: 3000 });
        }
        else
        {
            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'delete',
                url: '/api/role/'+role_id+'/permission/'+permission_id+'/delete',
                headers: header,

            }).then(response => {
                const resp = response.data;
                console.log(resp);
                if (response.data.status === 'error')
                {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                }
                else
                {
                    if (resp == 'Access Denied')
                    {
                        toast.warning(resp, {autoClose: 3000});
                    }
                    else
                    {
                        toast.success("Permission Deleted !", {  autoClose: 3000 });
                        var current_permissions = this.state.permissions;

                        for(var i=0; i<current_permissions.length; i++)
                        {
                            if(current_permissions[i].id == permission_id)
                            {
                                current_permissions.splice(i,1);
                                this.setState({permissions:current_permissions});
                            }
                        }
                    }
                }
            });
        }
    }

    render()
    {
        var link_styling = {
            marginBottom: '15px',
            marginTop: '10px',
            marginRight: '15px'
        };

        const role_id = this.state.role_id;
        const role_name = this.state.role_name;

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">{role_name} Permissions</h4>
                        <Link to={{ pathname: '/role/permissions/add', role_id: role_id, role_name: role_name}} className="btn btn-success btn-sm float-right" style={{marginTop: -35}}>Add New +</Link>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" ref="role_permissions_table">
                            <thead>
                                <tr style={{backgroundColor: '#8fbeec'}}>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                { this.state.permissions.map((permission, index)=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{index+1}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <a className="btn btn-danger btn-sm text-white" onClick={this.onDelete.bind(this,permission.id,role_id)}>Delete</a>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>

                        <Link className="btn btn-primary float-right" to={`/roles`} style={link_styling}>Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}