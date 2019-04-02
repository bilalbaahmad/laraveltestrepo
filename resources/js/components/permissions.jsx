import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

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
        });
    }

    onDelete(permission_id)
    {
        axios.delete('/api/permission/delete/'+permission_id).then(response=>{
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
        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">All Permissions</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr style={{backgroundColor: '#8fbeec'}}>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.permissions.map(permission=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{permission.id}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <div className="dropdown show">
                                                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Action
                                                    </a>

                                                    {/*<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <Link style={link_styling} to={`/permission/edit/${permission.id}`}>Edit</Link>
                                            <a className="dropdown-item" onClick={this.onDelete.bind(this,permission.id)}>Delete</a>
                                        </div>*/}
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
