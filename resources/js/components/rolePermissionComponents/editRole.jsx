import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import Joi from "joi-browser";

import Input from "../sharedComponents/input";

export default class EditRole extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            new_role: {
                role: ''
            },
            redirect: false,
            role_id: this.props.location.role_id,
            errors: {}
        }
    }

    schema = {
        role: Joi.string()
            .required()
            .label("Role")
    };

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
            const oldState = { ...this.state.new_role };
            const role_id = this.state.role_id;

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'get',
                url: '/api/role/'+role_id+'/view',
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
                        oldState.role = response.data.name;
                        this.setState({new_role:oldState});
                    }
                }
            });
        }
    }

    validate = () => {

        const result = Joi.validate(this.state.new_role, this.schema, { abortEarly: false });

        if (!result.error) return null;

        const errors = {};
        for (let item of result.error.details)
        {
            errors[item.path[0]] = item.message;
        }
        return errors;
    };

    ValidateProperty = ({ name, value }) => {

        const obj = { [name]: value };
        const subschema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, subschema);
        return error ? error.details[0].message : null;
    };

    handleChange = ({ currentTarget: input }) => {

        const errors = { ...this.state.errors };
        const errorMessage = this.ValidateProperty(input);
        if (errorMessage)
        {
            errors[input.name] = errorMessage;
        }
        else
        {
            delete errors[input.name];
        }

        const new_role = { ...this.state.new_role };
        new_role[input.name] = input.value;
        this.setState({ new_role, errors });
    };

    handleSubmit = e => {

        e.preventDefault();

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
            const errors = this.validate();

            this.setState({ errors: errors || {} });

            if (errors) return;

            const oldState = { ...this.state.new_role };

            const FD = new FormData();
            FD.append('role_id', this.state.role_id);
            FD.append('role', this.state.new_role.role);

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'post',
                url: '/api/roles/update',
                headers: header,
                data:FD,

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
                        oldState.role = response.data;
                        toast.success("Role Updated !", {  autoClose: 3000 });
                        this.setState({new_role:oldState,redirect: true});
                    }
                }
            });
        }
    };

    render()
    {
        const { redirect } = this.state;

        if (redirect)
        {
            return <Redirect to='/roles' />;
        }

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Edit Role</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="role"
                                type="text"
                                label="Role Name"
                                value={this.state.new_role.role}
                                onChange={this.handleChange}
                                error={this.state.errors.role}
                            />

                            <button disabled={this.validate()} className="btn btn-primary"> Update </button>
                            <Link className="btn btn-primary float-right" to={`/roles`}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
