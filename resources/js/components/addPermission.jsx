import React, { Component } from "react";
import Input from "./sharedComponents/input";
import Joi from "joi-browser";

class AddPermission extends Component {

    state = {
        new_permission: {
            permission: ""
        },
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
        return (
            <div>
                <h1>Add Permission</h1> <br />
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
                </form>
            </div>
        );
    }
}

export default AddPermission;
