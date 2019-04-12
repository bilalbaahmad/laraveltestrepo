import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

export default class Logout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    state = {
        redirect: false
    };

    componentDidMount()
    {
        var token = '';
        if(localStorage.hasOwnProperty('access_token'))
        {
            token = localStorage.getItem('access_token');
        }

        if(token == '')
        {
            toast.error("You are not logged in !", {  autoClose: 3000 });
        }
        else {
            var header = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            };

            axios({
                method: 'post',
                url: '/api/user/logout',
                headers: header,

            }).then(response => {
                if (response.data.status === 'error') {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                }
                else {
                    localStorage.clear();
                    toast.success('Logged out !', {autoClose: 3000});
                    this.props.rerenderParentCallback();
                    this.setState({ redirect: true });
                }
            });

        }
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/login'/>;
        }

        return(
            <div></div>
        )


    }
}
