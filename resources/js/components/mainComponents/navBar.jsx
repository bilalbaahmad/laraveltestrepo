import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';


export default class NavBar extends Component {

    onDownload()
    {
        axios.get('/api/download', { headers: { "Cache-Control": "no-cache" }}).then(response=>{
            const resp = response.data;
            if(resp == 'File Not Found' || resp == 'Access Denied')
            {
                toast.warning(resp, {  autoClose: 3000 });
            }
            else
            {
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