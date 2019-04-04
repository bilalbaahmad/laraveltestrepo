import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

export default class Roles extends Component {

    constructor(props)
    {
        super(props);

        this.state={
            all_permissions:[],
            role_permissions:[],
            role_id: this.props.location.role_id,
            role_name: this.props.location.role_name,
        }
    }

    onStatusChange(e)
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

        axios.post('/api/role/permissions/update',FD).then(response=>{
            const resp = response.data;
            toast.success("Permission "+resp+" !", {  autoClose: 3000 });
        });

    }

    componentDidMount()
    {
        const role_id = this.state.role_id;

        axios.get('/api/allpermissions').then(response=>{
            this.setState({all_permissions:response.data});
        });

        axios.get('/api/role/'+role_id+'/permissions').then(response=>{
            this.setState({role_permissions:response.data});
            this.state.role_permissions.forEach(permission => {
                let ref = 'permissionCheckbox_' + permission.id;
                this.refs[ref].checked = true;
            } );
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
                        <h4 className="card-title">Add {role_name} Permissions</h4>
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
                                this.state.all_permissions.map((permission, index)=>{
                                    return(
                                        <tr key={permission.id}>
                                            <th>{index+1}</th>
                                            <td>{permission.name}</td>
                                            <td>
                                                <input type="checkbox" id={"permissionCheckbox_"+permission.id} ref={"permissionCheckbox_"+permission.id} onClick={this.onStatusChange.bind(this)} value={permission.id}/>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        <Link style={{marginBottom:15}} className="btn btn-primary float-right" to={{ pathname: '/role/permissions', role_id: role_id, role_name: role_name }}>Ok</Link> <br />
                    </div>
                </div>
            </div>
        );
    }
}
