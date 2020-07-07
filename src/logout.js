import React from "react";
import { socket } from "./socket";
export default function Logout() {
    socket.request.session.userID = "null";
}
