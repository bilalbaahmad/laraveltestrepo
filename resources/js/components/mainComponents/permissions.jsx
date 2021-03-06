import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'react-loading-spinkit';
import axios from 'axios';

export default class Permissions extends Component
{
    constructor()
    {
        super();

        this.state={
            permissions:[],
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
                url: '/api/allpermissions',
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
                        this.setState({loading: false});
                    }
                    else
                    {
                        this.setState({permissions:response.data, loading: false});

                        $(this.refs.permissions_table).DataTable({
                            paginate: true,
                            scrollCollapse: true,
                            ordering: true,
                        });
                    }
                }
            });
        }
    }

    onDelete(permission_id)
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
                url: '/api/permission/'+permission_id+'/delete',
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
            marginLeft: '25px',
            color: 'black'
        };

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">All Permissions</h4>
                        <Link to={`/permissions/add`} className="btn btn-success btn-sm float-right" style={{marginTop: -35}}>Add New +</Link>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" ref="permissions_table">
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
                                            <div className="dropdown show">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Action
                                                </a>

                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                    <Link style={link_styling} to={{ pathname: '/permission/edit', permission_id: permission.id}}>Edit</Link>
                                                    <a className="dropdown-item" onClick={this.onDelete.bind(this,permission.id)}>Delete</a>
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