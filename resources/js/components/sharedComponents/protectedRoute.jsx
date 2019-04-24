import React from "react";
import { Route, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';

const ProtectedRoute = ({component: Component, ...rest  })=> {

    var result = false;
    result = rest.permissions.some(permission => rest.name === permission) ? true : false;

    return (
        <Route
            {...rest}
            render={props => {
                if (result) {
                    return <Component {...props} />;
                }
                else
                {
                    if(rest.permissions != '')
                    toast.warning('Access Denied', {  autoClose: 3000 });

                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    );
                }
            }}
        />
    );
};


export default ProtectedRoute;