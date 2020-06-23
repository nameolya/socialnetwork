import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";

let elem;

// this will be truthy or falsy:
const userIsNotLoggedIn = location.pathname === "/welcome";

if (!userIsNotLoggedIn) {
    elem = <h1>Here will be the social network page</h1>;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
