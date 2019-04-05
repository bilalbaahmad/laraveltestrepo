import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Input from "../sharedComponents/input";
import Joi from "joi-browser";
import axios from 'axios';
import { toast } from 'react-toastify';

class AddPermission extends Component {

    state = {
        new_permission: {
            permission: ""
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
        const result = Joi.validate(this.state.new_permission, this.schema, {
            abortEarly: false
        });


        if (!result.error) return null;

        const errors = {};
        for (let item of result.error.details) {
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

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate();

        this.setState({ errors: errors || {} });

        if (errors) return;

        const oldState = { ...this.state.new_permission };

        const FD = new FormData();
        FD.append('permission', this.state.new_permission.permission);

        axios.post('/api/permissions/add',FD).then(response=>{
            oldState.permission = response.data;
            toast.success("New Permission Added !", {  autoClose: 3000 });
            this.setState({new_permission:oldState,redirect: true});
        });
    };

    handleChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.ValidateProperty(input);
        if (errorMessage) {
            errors[input.name] = errorMessage;
        } else {
            delete errors[input.name];
        }

        const new_permission = { ...this.state.new_permission };
        new_permission[input.name] = input.value;
        this.setState({ new_permission, errors });
    };

    render() {

        const { redirect } = this.state;

        if (redirect) {
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

                            <button disabled={this.validate()} className="btn btn-primary">
                                Add
                            </button>

                            <Link className="btn btn-primary float-right" to={`/permissions`}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPermission;