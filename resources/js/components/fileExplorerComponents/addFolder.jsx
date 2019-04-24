import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Joi from "joi-browser";
import axios from 'axios';

import Input from "../sharedComponents/input";

class AddFolder extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            folder: {
                folder_name: ''
            },
            folder_id: this.props.location.folder_id,
            redirect_to_file_explorer: false,
            redirect_back: false,
            errors: {}
        }
    }

    componentDidMount()
    {
        if(this.state.folder_id == null)
        {
            this.setState({redirect_to_file_explorer: true});
        }
    }

    schema = {
        folder_name: Joi.string()
            .required()
            .label("Folder Name")
    };

    validate = () => {

        const result = Joi.validate(this.state.folder, this.schema, { abortEarly: false });

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

        const folder = { ...this.state.folder };
        folder[input.name] = input.value;
        this.setState({ folder, errors });
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

            const oldState = { ...this.state.folder };
            const folder_id = this.state.folder_id;

            const FD = new FormData();
            FD.append('folder_id', this.state.folder_id);
            FD.append('folder_name', this.state.folder.folder_name);

            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'post',
                url: '/api/folder/add',
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
                        toast.success("New Folder Created !", {  autoClose: 3000 });
                        this.setState({redirect_back: true});
                    }
                }
            });
        }
    };

    render() {

        const { redirect_to_file_explorer, redirect_back } = this.state;

        if (redirect_to_file_explorer)
        {
            return <Redirect to={{ pathname: '/explorer', state: { folder_id: '0'} }} />;
        }

        if (redirect_back)
        {
            return <Redirect to={{ pathname: '/explorer', state: { folder_id: this.state.folder_id} }} />;
        }

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Create Folder</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="folder_name"
                                type="text"
                                label="Folder Name"
                                value={this.state.folder.folder_name}
                                onChange={this.handleChange}
                                error={this.state.errors.folder_name}
                            />

                            <button disabled={this.validate()} className="btn btn-primary"> Create </button>

                            <Link className="btn btn-primary float-right" to={{ pathname: '/explorer', state: { folder_id: this.state.folder_id} }}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddFolder;
