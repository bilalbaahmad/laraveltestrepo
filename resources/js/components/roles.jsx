import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class Roles extends Component {

    constructor()
    {
        super();
        this.state={
            roles:[]
        }
    }

    componentDidMount()
    {
        axios.get('/api/allroles').then(response=>{
            this.setState({roles:response.data});
        });
    }

    onDelete(permission_id)
    {
        axios.delete('/api/roles/delete/'+permission_id).then(response=>{
            var current_roles = this.state.roles;

            for(var i=0; i<current_roles.length; i++)
            {
                if(current_roles[i].id == permission_id)
                {
                    current_roles.splice(i,1);
                    this.setState({roles:current_roles});
                }
            }
        });
    }



    render() {
        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">All Roles</h4>
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
                                this.state.roles.map(role=>{
                                    return(
                                        <tr key={role.id}>
                                            <th>{role.id}</th>
                                            <td>{role.name}</td>
                                            <td>
                                                <div className="dropdown show">
                                                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Action
                                                    </a>

                                                    {/*<div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <Link style={link_styling} to={`/role/edit/${role.id}`}>Edit</Link>
                                            <a className="dropdown-item" onClick={this.onDelete.bind(this,role.id)}>Delete</a>
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
