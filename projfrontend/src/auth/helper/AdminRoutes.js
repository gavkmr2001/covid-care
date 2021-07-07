import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";



//copied from net ..
// https://reactrouter.com/web/example/auth-workflow
//changed into arrow function

//children if want to populate multiple things..else use component
const AdminRoute = ({ component: Component , ...rest }) => {
    return (
      <Route
        {...rest}
        render={ props =>
          isAuthenticated() && isAuthenticated().user.role === 1 ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  

export default AdminRoute;