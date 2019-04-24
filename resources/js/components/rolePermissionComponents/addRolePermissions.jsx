import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from 'react-loading-spinkit';

export default class AddRolePermissions extends Component {

    constructor(props)
    {
        super(props);

        this.state={
            all_permissions:[],
            role_permissions:[],
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
                url: '/api/allpermissions',
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
                        this.setState({all_permissions:response.data, loading: false});

                        $(this.refs.role_permissions_table).DataTable({
                            paginate: true,
                            scrollCollapse: true,
                            ordering: true,
                        });
                    }
                }
            });


            axios({
                method: 'get',
                url: '/api/role/'+role_id+'/permissions',
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
                        this.setState({role_permissions:response.data});
                        this.state.role_permissions.map(permission => {
                            let ref = 'permissionCheckbox_' + permission.id;
                            this.refs[ref].checked = true;
                        } );
                    }
                }
            });
        }
    }

    onStatusChange(e)
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
            const value = e.target.value;
            const checked = e.target.checked;

            var status = 0;
            if(checked) status = 1;

            const FD = new FormData();
            FD.append('role_id', role_id);
            FD.append('permission_id', value);
            FD.append('status', status);

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'post',
                url: '/api/role/permissions/update',
                headers: header,
                data: FD,

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
                        const resp = response.data;
                        toast.success("Permission "+resp+" !", {  autoClose: 3000 });
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
                        <h4 className="card-title">Add {role_name} Permissions</h4>
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
                                { this.state.all_permissions.map((permission, index)=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{index+1}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <input type="checkbox" ref={"permissionCheckbox_"+permission.id} onClick={this.onStatusChange.bind(this)} value={permission.id}/>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>

                        <Link style={link_styling} className="btn btn-primary float-right" to={{ pathname: '/role/permissions', role_id: role_id, role_name: role_name }}>Ok</Link> <br />
                    </div>
                </div>
            </div>
        );
    }
}