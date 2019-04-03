import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class RolePermissions extends Component {

    constructor(props)
    {
        super(props);
        this.state={
            permissions:[]
        }
    }

    onDelete(permission_id,role_id)
    {
        axios.delete('/api/role/'+role_id+'/permission/delete/'+permission_id).then(response=>{

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

    componentDidMount()
    {
        const role_id = this.props.match.params.id;

        axios.get('/api/role/'+role_id+'/permissions').then(response=>{
            this.setState({permissions:response.data});
        });
    }

    render() {
        var link_styling = {
            marginLeft: '25px',
            color: 'black'
        };

        const role_id = this.props.match.params.id;
        const role_name = this.props.match.params.name;

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">{role_name} Permissions</h4>
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
                                this.state.permissions.map((permission, index)=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{index+1}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <a className="btn btn-danger text-white" onClick={this.onDelete.bind(this,permission.id,role_id)}>Delete</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        <Link className="btn btn-primary float-right" to={`/roles`} style={{marginBottom: 15}}>Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}
