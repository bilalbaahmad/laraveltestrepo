import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import Joi from "joi-browser";
import axios from 'axios';
import Input from "../sharedComponents/input";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: {
                email: "",
                password: ""
            },
            errors: {}
        };
    }

    schema = {
        email: Joi.string()
            .required()
            .label("Email"),
        password: Joi.string()
            .required()
            .label("Password")
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

  ValidateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const subschema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, subschema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {

    e.preventDefault();

    localStorage.clear();

    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    var data = {
        client_id: 2,
        client_secret: 'RrrmaSW7TbQRnGkZNIjQVOIFfj1nyu7k5vC6YJv3',
        grant_type: 'password',
        username: this.state.account.email,
        password: this.state.account.password,
        scope: '*'
    };

      var header = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

    axios.post('/oauth/token', data, {headers: header}).then(response=>{

        var token = response.data['access_token'];

        if (token != '')
        {
            localStorage.setItem('access_token',token);
            localStorage.setItem('login_status',true);
            this.setState({account: { email: "", password: "" }});
            toast.success('Logged-in', {  autoClose: 3000 });
            window.location = '/';
        }
    }).catch(function (error) {

        if(error.response.status == 401)
        {
            toast.error('Invalid Credentials !', {  autoClose: 3000 });
        }
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

    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account, errors });
  };

  render() {
      return (
          <div className="card">
              <div className="card-head">
                  <div className="card-header">
                      <h4 className="card-title">Login</h4>
                  </div>
              </div>

              <div className="card-content collapse show">
                  <div className="card-body card-dashboard">
                      <form onSubmit={this.handleSubmit}>
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
                          <button disabled={this.validate()} className="btn btn-primary">
                              Login
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }
}

export default Login;
