import React, { Component } from 'react';
import { NavLink, Route } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

class NavBar extends Component {

    onDownload()
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

            axios.get('/api/download', {headers: header}).then(response=>{
                const resp = response.data;
                if(response.data.status === 'error')
                {
                    toast.warning('Something went wrong !', {  autoClose: 3000 });
                }
                else
                {
                    if (resp == 'File Not Found' || resp == 'Access Denied') {
                        toast.warning(resp, {autoClose: 3000});
                    }
                    else {
                        var contentType = response.headers['content-type'];
                        var contentDisposition = response.headers['content-disposition'];
                        var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                        /* let blob = new Blob([response.data], { type: contentType });
                         let link = document.createElement('a');
                         link.href = window.URL.createObjectURL(blob);
                         link.download = filename;
                         link.click();*/

                        window.open('/api/download');
                    }
                }
            });
        }
    }

  render()
  {
      return (
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
              <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                      <li className="nav-item">
                          <NavLink className="nav-link" to="/">
                              Home
                          </NavLink>
                      </li>

                      <li className="nav-item">
                          <NavLink className="nav-link" to="/permissions">
                              Permissions
                          </NavLink>
                      </li>

                      <li className="nav-item">
                          <NavLink className="nav-link" to="/roles">
                              Roles
                          </NavLink>
                      </li>

                      <li className="nav-item">
                          <NavLink className="nav-link" to="/users">
                              Users
                          </NavLink>
                      </li>

                      <li className="nav-item">
                          <a className="nav-link" onClick={this.onDownload.bind(this)}>
                              Download File
                          </a>
                      </li>

                      <li className="nav-item">
                          <NavLink className="nav-link" to="/register">
                              Register
                          </NavLink>
                      </li>

                      {localStorage.hasOwnProperty('login_status') ? ((localStorage.getItem('login_status')) ? <li className="nav-item"><NavLink className="nav-link" to="/logout"> Logout </NavLink></li> : <li className="nav-item"><NavLink className="nav-link" to="/login"> Login </NavLink></li>) : <li className="nav-item"><NavLink className="nav-link" to="/login"> Login </NavLink></li>}
                  </ul>
              </div>
          </nav>
      );
  }
}

export default NavBar;