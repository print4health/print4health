import { Redirect, Route } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import { set } from "react-ga";

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any,
  authed: PropTypes.bool,
  setAlert: PropTypes.func,
};

function PrivateRoute({component: Component, authed, setAlert}) {

  {authed !== true && setAlert('You are not authorized to access this page. Please log in.', 'danger') }

  return (
    <Route
      render={(props) => authed === true
        ? <Component {...props} />
        //@TODO change redirect to Login when we have a Login Page
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;
