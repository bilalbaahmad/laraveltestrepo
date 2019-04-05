import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from 'react-loading-spinkit';

export default class Roles extends Component {

    constructor(props)
    {
        super(props);

        this.state={
            all_roles:[],
            user_roles:[],
            user_id: this.props.location.user_id,
            user_name: this.props.location.user_name,
            loading: true,
        }
    }

    componentDidMount()
    {
        const user_id = this.state.user_id;

        axios.get('/api/allroles').then(response=>{
            this.setState({all_roles:response.data, loading: false});

            $(this.refs.user_roles_table).DataTable({
                paginate: true,
                scrollCollapse: true,
                ordering: true,
            });
        });

        axios.get('/api/user/'+user_id+'/roles').then(response=>{
            this.setState({user_roles:response.data.roles});
            this.state.user_roles.forEach(role => {
                let ref = 'roleCheckbox_' + role.id;
                this.refs[ref].checked = true;
            } );
        });
    }

    onStatusChange(e)
    {
        const user_id = this.state.user_id;
        const value = e.target.value;
        const checked = e.target.checked;
        var status = 0;
        if(checked) status = 1;

        const FD = new FormData();
        FD.append('user_id', user_id);
        FD.append('role_id', value);
        FD.append('status', status);

        axios.post('/api/user/roles/update',FD).then(response=>{
            const resp = response.data;
            toast.success("Role "+resp+" !", {  autoClose: 3000 });
        });
    }

    render() {

        var link_styling = {
            marginBottom: '15px',
            marginTop: '10px',
            marginRight: '15px'
        };

        const user_name = this.state.user_name;

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Manage { user_name } Roles</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <table className="table table-striped table-bordered" ref="user_roles_table">
                            <thead>
                                <tr style={{backgroundColor: '#8fbeec'}}>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.all_roles.map((role, index)=>{
                                    return(
                                        <tr key={role.id}>
                                            <th>{index+1}</th>
                                            <td>{role.name}</td>
                                            <td>
                                                <input type="checkbox" id={"roleCheckbox_"+role.id} ref={"roleCheckbox_"+role.id} onClick={this.onStatusChange.bind(this)} value={role.id}/>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        <Link className="btn btn-primary float-right" to={`/users`} style={link_styling}>Back</Link>
                    </div>
                </div>
            </div>
        );
    }
}
