import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';


export default class NavBar extends Component {

    onDownload()
    {
        let value = '';

        if (localStorage.hasOwnProperty('access_token'))
        {
            // get the key's value from localStorage
            value = localStorage.getItem('access_token');
        }

        var header = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${value}`,
            'Cache-Control': 'no-cache'
        }

        axios.get('/api/download', {headers: header}).then(response=>{
            const resp = response.data;
            if(resp == 'File Not Found' || resp == 'Access Denied')
            {
                toast.warning(resp, {  autoClose: 3000 });
            }
            else
            {
                var contentType = response.headers['content-type'];
                var contentDisposition = response.headers['content-disposition'];
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

               /* let blob = new Blob([response.data], { type: contentType });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();*/

                window.open('/api/download/');
            }
        });
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
                          <NavLink className="nav-link" to="/login">
                              Login
                          </NavLink>
                      </li>
                  </ul>
              </div>
          </nav>
      );
  }
}