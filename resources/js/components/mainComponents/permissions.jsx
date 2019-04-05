import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

export default class Permissions extends Component {

    constructor()
    {
        super();
        this.state={
            permissions:[]
        }
    }

    componentDidMount()
    {
        axios.get('/api/allpermissions').then(response=>{
            this.setState({permissions:response.data});

            $(this.refs.permissions_table).DataTable({
                paginate: true,
                scrollCollapse: true,
                ordering: true,
            });
        });
    }

    onDelete(permission_id)
    {
        axios.delete('/api/permission/delete/'+permission_id).then(response=>{
            toast.success("Permission Deleted !", {  autoClose: 3000 });

            $(this.refs.users_table).DataTable().destroy();

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

        return (
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
                            {
                                this.state.permissions.map((permission, index)=>{
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
                                                        <Link style={link_styling}  to={{ pathname: '/permission/edit', permission_id: permission.id}}>Edit</Link>
                                                        <a className="dropdown-item" onClick={this.onDelete.bind(this,permission.id)}>Delete</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        );
    }
}
