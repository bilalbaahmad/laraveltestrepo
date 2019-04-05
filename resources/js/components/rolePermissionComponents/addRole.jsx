import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Input from "../sharedComponents/input";
import Joi from "joi-browser";
import axios from 'axios';
import { toast } from 'react-toastify';

class AddRole extends Component {

    state = {
        new_role: {
            role: ""
        },
        redirect: false,
        errors: {}
    };

    schema = {
        role: Joi.string()
            .required()
            .label("Role")
    };

    validate = () => {
        const result = Joi.validate(this.state.new_role, this.schema, {
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

        const oldState = { ...this.state.new_role };

        const FD = new FormData();
        FD.append('role', this.state.new_role.role);

        axios.post('/api/roles/add',FD).then(response=>{
            oldState.role = response.data;
            toast.success("New Role Added !", {  autoClose: 3000 });
            this.setState({new_role:oldState,redirect: true});
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

        const new_role = { ...this.state.new_role };
        new_role[input.name] = input.value;
        this.setState({ new_role, errors });
    };

    render() {

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/roles' />;
        }

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Add Role</h4>
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

                            <button disabled={this.validate()} className="btn btn-primary">
                                Add
                            </button>

                            <Link className="btn btn-primary float-right" to={`/roles`}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddRole;
