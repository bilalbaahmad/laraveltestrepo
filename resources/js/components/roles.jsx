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
       /* $('#mytable').dataTable();*/

        axios.get('/api/allroles').then(response=>{
            this.setState({roles:response.data});
        });

        /*$('#mytable').dataTable({
            "sPaginationType": "full_numbers",
            "bAutoWidth": false,
            "bDestroy": true,
            "fnDrawCallback": function() {
            },

        });*/
    }


    onDelete(role_id)
    {
        axios.delete('/api/role/delete/'+role_id).then(response=>{
            var current_roles = this.state.roles;

            for(var i=0; i<current_roles.length; i++)
            {
                if(current_roles[i].id == role_id)
                {
                    current_roles.splice(i,1);
                    this.setState({roles:current_roles});
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
                        <h4 className="card-title">All Roles</h4>
                        <Link to={`/roles/add`} className="btn btn-success btn-sm float-right" style={{marginTop: -35}}>Add New +</Link>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" id="mytable">
                            <thead>
                                <tr style={{backgroundColor: '#8fbeec'}}>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.roles.map((role, index)=>{
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
                                                        <Link style={link_styling} to={`/role/${role.id}/${role.name}/permissions`}>View Permissions</Link> <br />
                                                        <Link style={link_styling} to={`/role/edit/${role.id}`}>Edit</Link>
                                                        <a className="dropdown-item" onClick={this.onDelete.bind(this,role.id)}>Delete</a>
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
