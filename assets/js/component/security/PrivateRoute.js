import { Redirect, Route } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any,
  authed: PropTypes.bool,
  setAlert: PropTypes.func,
  user: PropTypes.object,
  path: PropTypes.string,
};

function PrivateRoute({component: Component, setAlert, user, path}) {
  const authed = user && Object.keys(user).length !== 0;

  {authed !== true && setAlert('You are not authorized to access this page. Please log in.', 'danger') }

  return (
    <Route path={path}
      render={(props) => authed === true
        ? <Component {...props} />
        //@TODO change redirect to Login when we have a Login Page
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;
