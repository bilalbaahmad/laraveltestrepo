import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

export default class Logout extends Component
{
    constructor(props)
    {
        super(props);
    }

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
        else
        {
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
                if (response.data.status === 'error')
                {
                    toast.warning('Something went wrong !', {autoClose: 3000});
                }
                else
                {
                    toast.success('Logged out !', {autoClose: 3000});
                    localStorage.clear();
                    window.location = '/';
                }
            });
        }
    }

    render()
    {
        return(
            <div> </div>
        )
    }
}
