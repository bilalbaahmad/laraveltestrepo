import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'react-loading-spinkit';

export default class Users extends Component
{
    constructor()
    {
        super();

        this.state={
            users:[],
            loading: true,
        };
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
                url: '/api/allusers',
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
                        this.setState({users:response.data, loading: false});

                        $(this.refs.users_table).DataTable({
                            paginate: true,
                            scrollCollapse: true,
                            ordering: true,
                        });
                    }
                }
            });
        }
    }

    render()
    {
        var link_styling = {
            marginLeft: '25px',
            marginRight: '5px',
            color: 'black'
        };

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">All Users</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" ref="users_table">
                            <thead>
                                <tr style={{backgroundColor: '#8fbeec'}}>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Roles</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                            { this.state.users.map((user, index)=>{
                                return(
                                    <tr key={user.id}>
                                        <th>{index+1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.roles.map(user_role => { return(<span key={user_role.id} className='badge badge-success mr-1'> {user_role.name}</span>) })}</td>
                                        <td>
                                            <div className="dropdown show">
                                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Action
                                                </a>

                                                <div className="dropdown-menu" style={{width:230}} aria-labelledby="dropdownMenuLink">
                                                    <Link style={link_styling} to={{ pathname: '/user/roles', user_id: user.id, user_name: user.name }}>Manage Roles</Link> <br />
                                                    <Link style={link_styling} to={{ pathname: '/user/permissions', user_id: user.id, user_name: user.name }}>Manage Direct Permission</Link>
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