import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Input from "../sharedComponents/input";
import Joi from "joi-browser";
import axios from 'axios';
import { toast } from 'react-toastify';

class AddFolder extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            folder: {
                folder_name: ""
            },
            folder_id: this.props.location.folder_id,
            redirect_to_file_explorer: false,
            redirect_back: false,
            errors: {}
        }
    }

    componentDidMount()
    {
        if(this.state.folder_id == null){
            this.setState({redirect_to_file_explorer: true});
        }
    }

    schema = {
        folder_name: Joi.string()
            .required()
            .label("Folder Name")
    };

    validate = () => {
        const result = Joi.validate(this.state.folder, this.schema, {
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

        const oldState = { ...this.state.folder };
        const folder_id = this.state.folder_id;
        const FD = new FormData();
        FD.append('folder_id', this.state.folder_id);
        FD.append('folder_name', this.state.folder.folder_name);

        axios.post('/api/folder/add',FD).then(response=>{
            console.log(response.data);
            toast.success("New Folder Created !", {  autoClose: 3000 });
            this.setState({redirect_back: true});
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

        const folder = { ...this.state.folder };
        folder[input.name] = input.value;
        this.setState({ folder, errors });
    };

    render() {

        const { redirect_to_file_explorer, redirect_back } = this.state;

        if (redirect_to_file_explorer) {
            return <Redirect to={{ pathname: '/explorer', state: { folder_id: '0'} }} />;
        }
        if (redirect_back) {
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

                            <button disabled={this.validate()} className="btn btn-primary">
                                Create
                            </button>

                            <Link className="btn btn-primary float-right" to={{ pathname: '/explorer', state: { folder_id: this.state.folder_id} }}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddFolder;
