import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

export default class RolePermissions extends Component {

    constructor(props)
    {
        super(props);
        this.state={
            permissions:[],
            role_id: this.props.location.role_id,
            role_name: this.props.location.role_name,
        }
    }

    componentDidMount()
    {
        const role_id = this.state.role_id;

       axios.get('/api/role/'+role_id+'/permissions').then(response=>{
            this.setState({permissions:response.data});

           $(this.refs.role_permissions_table).DataTable({
               paginate: true,
               scrollCollapse: true,
               ordering: true,
           });
        });
    }

    onDelete(permission_id,role_id)
    {
        axios.delete('/api/role/'+role_id+'/permission/delete/'+permission_id).then(response=>{
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
        });
    }

    render() {
        var link_styling = {
            marginLeft: '25px',
            color: 'black'
        };

        const role_id = this.state.role_id;
        const role_name = this.state.role_name;

        return (
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
                            {
                                this.state.permissions.map((permission, index)=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{index+1}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <a className="btn btn-danger btn-sm text-white" onClick={this.onDelete.bind(this,permission.id,role_id)}>Delete</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        <Link className="btn btn-primary float-right" to={`/roles`} style={{marginBottom: 15, marginTop: 10, marginRight: 10}}>Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}
