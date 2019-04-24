import React from "react";
import { Route, Redirect } from "react-router-dom";

const VerifyLoginRoute = ({component: Component, ...rest  })=> {

    const status = rest.login_status;

    return (
        <Route
            {...rest}
            render={props => {
                if (status)
                {
                    return <Component {...props} />;
                }
                else
                {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    );
                }
            }}
        />
    );
};


export default VerifyLoginRoute;

