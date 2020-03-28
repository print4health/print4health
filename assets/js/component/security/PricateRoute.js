import { Redirect, Route } from "react-router-dom";
import React from "react";

function PrivateRoute({component: Component, authed}) {
  return (
    <Route
      render={(props) => authed === true
        ? <Component {...props} />
        //@TODO display a flashmessage and change redirect to Login when we have a Login Page
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;
