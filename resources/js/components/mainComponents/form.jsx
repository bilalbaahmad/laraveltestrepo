import React, { Component, Children } from "react";
import Recaptcha from 'react-recaptcha';
import Input from "../sharedComponents/input";

export default class Form extends Component
{
    constructor()
    {
        super();

        this.onCaptchaLoad = this.onCaptchaLoad.bind(this);
        this.onCaptchaVerify = this.onCaptchaVerify.bind(this);
    }

    state = {
        user_name:'',
        email: '',
        password: '',
        city: '',
        text_area: '',
        future_date: '',
        check1: false,
        check2: false,
        radio: null,
        isvarified: false,
    };

    handleChange = ({ currentTarget: input }) => {

        let inp_name = input.name;
        let value = input.value;

        this.setState({[inp_name]:value});
    };

    handleCheck = e => {

        let name = e.target.name;
        let checked = e.target.checked;

        this.setState({[name]:checked});
    };

    handleRadio = e => {

        let value = e.target.value;
        this.setState({radio:value});
    };

    onCaptchaLoad()
    {
        console.log('captcha loaded');
    }

    onCaptchaVerify()
    {
        this.setState({isvarified:true});
    }

    handleSubmit = e => {

        e.preventDefault();

        let curr_date = new Date().toISOString().slice(0, 10);

        let state = { ...this.state };

        if(state.user_name == '')
        {
            swal("Warning!", "Name Field Is Required", "warning");
            return false;
        }
        else if(state.email == '')
        {
            swal("Warning!", "Email Field Is Required", "warning");
            return false;
        }
        else if(state.password == '')
        {
            swal("Warning!", "Passowrd Field Is Required", "warning");
            return false;
        }
        else if(state.password.length < 6)
        {
            swal("Warning!", "Passowrd Minimum Length Must Be Greater Than 6 Characters", "warning");
            return false;
        }
        else if(state.password.length > 12)
        {
            swal("Warning!", "Passowrd Minimum Length Must Be Smaller Than 13 Characters", "warning");
            return false;
        }
        else if(state.city == '' || state.city == '0')
        {
            swal("Warning!", "City Field Is Required", "warning");
            return false;
        }
        else if(state.future_date == '')
        {
            swal("Warning!", "Date Field Is Required", "warning");
            return false;
        }
        else if(state.future_date <= curr_date)
        {
            swal("Warning!", "Select Future Date", "warning");
            return false;
        }
        else if(state.text_area == '')
        {
            swal("Warning!", "Text Area Field Is Required", "warning");
            return false;
        }
        else if(state.radio == null)
        {
            swal("Warning!", "Radio Selection Is Required", "warning");
            return false;
        }
        else if(state.isvarified == false)
        {
            swal("Warning!", "Check Captcha To Verify You Are Human", "warning");
            return false;
        }

        console.log('form submitted');
    };

    render()
    {
        const state = this.state;

        return (
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Form</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="user_name"
                                type="text"
                                label="Name"
                                onChange={this.handleChange}
                            />

                            <Input
                                name="email"
                                type="email"
                                label="Email"
                                onChange={this.handleChange}
                            />

                            <Input
                                name="password"
                                type="password"
                                label="Password"
                                onChange={this.handleChange}
                            />

                            <label>City:</label> <br />
                            <select className='form-control' id='city' name='city' onChange={this.handleChange}>
                                <option value='0'>Select</option>
                                <option value='1'>Lahore</option>
                                <option value='2'>Karachi</option>
                                <option value='3'>Islamabad</option>
                            </select> <br />

                            <label>Date:</label> <br />
                            <input className='form-control' type='date' name='future_date' onChange={this.handleChange}/> <br />

                            <label>Text Aera:</label> <br />
                            <textarea className='form-control' name='text_area' onChange={this.handleChange}/> <br />

                            <label>CheckBox:</label> <br />

                            <input type='checkbox' name='check1' onClick={this.handleCheck} value='a'/> a {' '}
                            <input type='checkbox' name='check2' onClick={this.handleCheck} value='b'/> b <br />

                            {
                                state.check1 ?
                                <div>
                                    <span>Checkbox 1 Div</span> <br />
                                </div> : ''
                            }
                            {
                                state.check2 ?
                                    <div>
                                        <span>Checkbox 2 Div</span> <br />
                                    </div> : ''
                            }

                            <label>Radio:</label> <br />

                            <input type='radio' name='radio' id='radio1' onClick={this.handleRadio} value='a'/> a {' '}
                            <input type='radio' name='radio' id='radio2' onClick={this.handleRadio} value='b'/> b {' '}
                            <input type='radio' name='radio' id='radio3' onClick={this.handleRadio} value='c'/> c <br />

                            {
                                state.radio == 'a' ?
                                <div>
                                    <span>Radio a Div</span> <br />
                                </div> : ''
                            }
                            {
                                state.radio == 'b' ?
                                    <div>
                                        <span>Radio b Div</span> <br />
                                    </div> : ''
                            }
                            {
                                state.radio == 'c' ?
                                    <div>
                                        <span>Radio c Div</span> <br />
                                    </div> : ''
                            }

                            <br />

                            <Recaptcha
                                sitekey="6LdFtaoUAAAAAL5cA-9OzQw-83BGVxCBiyMO--4I"
                                render="explicit"
                                verifyCallback={this.onCaptchaVerify}
                                onloadCallback={this.onCaptchaLoad}
                            />

                            <button className="btn btn-primary"> Submit </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}