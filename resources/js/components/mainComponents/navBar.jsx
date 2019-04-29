import React, { Component } from 'react';
import { Link, NavLink, Route } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

export default class NavBar extends Component
{
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
                            <NavLink className="nav-link" to="/chart">
                                Charts
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/highCharts">
                                High Charts
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to={{ pathname: '/explorer', state: { folder_id: '0'} }}>Explorer</Link> {/*folder id = 0 for root folder*/}
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