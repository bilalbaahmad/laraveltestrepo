import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Joi from "joi-browser";
import axios from 'axios';

import Input from "../sharedComponents/input";

export default class AddPermission extends Component
{
    state = {
        new_permission: {
            permission: ''
        },
        redirect: false,
        errors: {}
    };

    schema = {
        permission: Joi.string()
            .required()
            .label("Permission")
    };

    validate = () => {

        const result = Joi.validate(this.state.new_permission, this.schema, { abortEarly: false });

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

        const new_permission = { ...this.state.new_permission };
        new_permission[input.name] = input.value;
        this.setState({ new_permission, errors });
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

            const oldState = { ...this.state.new_permission };

            const FD = new FormData();
            FD.append('permission', this.state.new_permission.permission);

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'post',
                url: '/api/permissions/add',
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
                        oldState.permission = response.data;
                        toast.success("New Permission Added !", {  autoClose: 3000 });
                        this.setState({new_permission:oldState,redirect: true});
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
            return <Redirect to='/permissions' />;
        }

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Add Permission</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="permission"
                                type="text"
                                label="Permission Name"
                                value={this.state.new_permission.permission}
                                onChange={this.handleChange}
                                error={this.state.errors.permission}
                            />

                            <button disabled={this.validate()} className="btn btn-primary"> Add </button>
                            <Link className="btn btn-primary float-right" to={`/permissions`}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
