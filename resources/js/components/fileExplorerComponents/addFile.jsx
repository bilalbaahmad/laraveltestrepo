import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Input from "../sharedComponents/input";
import Joi from "joi-browser";
import axios from 'axios';
import { toast } from 'react-toastify';

class AddFile extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            file: {
                file_name: ""
            },
            file_data: '',
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
        file_name: Joi.string()
            .required()
            .label("File Name")
    };

    validate = () => {
        const result = Joi.validate(this.state.file, this.schema, {
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

        const oldState = { ...this.state.file };
        const folder_id = this.state.folder_id;
        const FD = new FormData();
        FD.append('folder_id', this.state.folder_id);
        FD.append('file_data', this.state.file_data);
        FD.append('file_name', this.state.file.file_name);


        axios.post('/api/file/add',FD).then(response=>{
            console.log(response.data);
            toast.success("New File Uploaded !", {  autoClose: 3000 });
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

        const file = { ...this.state.file };
        file[input.name] = input.value;
        this.setState({ file, errors });
    };

    onfileChange(e){
        let data = e.target.files[0];
        this.setState({file_data: data});
    }

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
                        <h4 className="card-title">Upload File</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <input type="file" className="form-control-file" name="file_data" src={this.state.file_data} onChange={this.onfileChange.bind(this)}/> <br/>

                            <Input
                                name="file_name"
                                type="text"
                                label="File Name"
                                value={this.state.file.file_name}
                                onChange={this.handleChange}
                                error={this.state.errors.file_name}
                            />

                            <button disabled={this.validate()} className="btn btn-primary">
                                Upload
                            </button>

                            <Link className="btn btn-primary float-right" to={{ pathname: '/explorer', state: { folder_id: this.state.folder_id} }}>Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddFile;
