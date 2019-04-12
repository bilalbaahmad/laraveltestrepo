import React, { Component } from "react";
import Input from "../sharedComponents/input";
import Joi from "joi-browser";
import axios from 'axios';
import { toast } from 'react-toastify';

class Register extends Component {

    state = {
        account: {
            user_name: "",
            email: "",
            password: "",
            conf_password: ""
        },
        errors: {}
    };

    schema = {
        user_name: Joi.string() .required().label("Name"),
        email: Joi.string().required().label("Email"),
        password: Joi.string().min(6).max(20).required().label("Password"),
        conf_password: Joi.string().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
    };

    handleChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.ValidateProperty(input);
        if (errorMessage) {
            errors[input.name] = errorMessage;
        }
        else
        {
            console.log('delete');
            delete errors[input.name];
        }

        const account = { ...this.state.account };
        account[input.name] = input.value;
        this.setState({ account, errors });
    };

    ValidateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const subschema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, subschema);
        console.log(error);
        return error ? error.details[0].message : null;
    };

    handleSubmit = e => {

        e.preventDefault();

        localStorage.clear();

        const errors = this.validate();

        this.setState({ errors: errors || {} });

        if (errors) return;

        var header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const FD = new FormData();
        FD.append('name', this.state.account.user_name);
        FD.append('email', this.state.account.email);
        FD.append('password', this.state.account.password);

        console.log('final');
        axios.post('/api/user/register',FD , {headers: header}).then(response=>{
            localStorage.setItem('access_token', response.data.access_token);
        }).catch(function (error) {
            localStorage.clear();
            console.log(error.response);
        });
    };

    validate = () => {
        const result = Joi.validate(this.state.account, this.schema, {
            abortEarly: false
        });

        if (!result.error) return null;

        const errors = {};
        for (let item of result.error.details) {
            errors[item.path[0]] = item.message;
        }
        return errors;
    };

    render() {
        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Register</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="user_name"
                                type="text"
                                label="Name"
                                value={this.state.account.user_name}
                                onChange={this.handleChange}
                                error={this.state.errors.user_name}
                            />

                            <Input
                                name="email"
                                type="email"
                                label="Email Address"
                                value={this.state.account.email}
                                onChange={this.handleChange}
                                error={this.state.errors.email}
                            />

                            <Input
                                name="password"
                                type="password"
                                label="Passowrd"
                                value={this.state.account.password}
                                onChange={this.handleChange}
                                error={this.state.errors.password}
                            />

                            <Input
                                name="conf_password"
                                type="password"
                                label="Confirm Passowrd"
                                value={this.state.account.conf_password}
                                onChange={this.handleChange}
                                error={this.state.errors.conf_password}
                            />

                            <button disabled={this.validate()} className="btn btn-primary">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
