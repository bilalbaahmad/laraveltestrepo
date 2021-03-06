import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'react-loading-spinkit';
import axios from 'axios';

export default class Roles extends Component
{
    constructor()
    {
        super();

        this.state={
            roles:[],
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
            this.setState({loading: false});
        }
        else
        {
            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'get',
                url: '/api/allroles',
                headers: header,

            }).then(response => {
                const resp = response.data;
                if (response.data.status === 'error')
                {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                    this.setState({loading: false});
                }
                else
                {
                    if (resp == 'Access Denied')
                    {
                        toast.warning(resp, {autoClose: 3000});
                    }
                    else
                    {
                        this.setState({roles:response.data, loading: false});

                        $(this.refs.roles_table).DataTable({
                            paginate: true,
                            scrollCollapse: true,
                            ordering: true,
                        });
                    }
                }
            });
        }
    }

    onDelete(role_id)
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
                url: '/api/role/'+role_id+'/delete',
                headers: header,

            }).then(response => {
                const resp = response.data;
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
                        toast.success("Role Deleted !", {  autoClose: 3000 });
                        var current_roles = this.state.roles;

                        for(var i=0; i<current_roles.length; i++)
                        {
                            if(current_roles[i].id == role_id)
                            {
                                current_roles.splice(i,1);
                                this.setState({roles:current_roles});
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
            marginLeft: '25px',
            color: 'black'
        };

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">All Roles</h4>
                        <Link to={`/roles/add`} className="btn btn-success btn-sm float-right" style={{marginTop: -35}}>Add New +</Link>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" ref="roles_table">
                            <thead>
                                <tr style={{backgroundColor: '#8fbeec'}}>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                            { this.state.roles.map((role, index) => {
                                return(
                                    <tr key={role.id}>
                                        <th>{index+1}</th>
                                        <td>{role.name}</td>
                                        <td>
                                            <div className="dropdown show">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Action
                                                </a>

                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                    <Link style={link_styling} to={{ pathname: '/role/permissions', role_id: role.id, role_name: role.name }}>Permissions</Link> <br />
                                                    <Link style={link_styling} to={{ pathname: '/role/edit', role_id: role.id}}>Edit</Link>
                                                    <a className="dropdown-item" onClick={this.onDelete.bind(this,role.id)}>Delete</a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
