import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Welcome from "./welcome";

let elem;

// this will be truthy or falsy:
const userIsNotLoggedIn = location.pathname === "/welcome";

if (!userIsNotLoggedIn) {
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
