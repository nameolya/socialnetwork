import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";

export default function Chat() {
    const history = useHistory();
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.messages);

    console.log("here are my last 10 chat messages: ", chatMessages);

    //making scrollbar positioned at the bottom:
    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // this will prevent going to the next line
            socket.emit("newMessage", e.target.value);
            e.target.value = ""; // clears input field after we click enter
        }
    };

    const routeChange = (id) => {
        let path = `/user/${id}`;
        history.push(path);
    };

    return (
        <div className="chat">
            <div className="chat-title">
                <h1>Welcome to Chat</h1>
            </div>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages
                        .slice(0)
                        .reverse()
                        .map((elem, idx) => {
                            const date = moment(`${elem.created_at}`).fromNow();
                            return (
                                <div key={idx}>
                                    <div className="chat-message-container">
                                        <div>
                                            <div className="profile-image">
                                                <img
                                                    className="small"
                                                    src={elem.imageurl}
                                                    onClick={(e) =>
                                                        routeChange(
                                                            `${elem.id}`
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="chat-message-text">
                                                {elem.first} {elem.last}:{" "}
                                                {elem.text}
                                            </p>
                                            <p className="chat-message-timestamp">
                                                ({date})
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
            </div>
            <div className="chat-textarea">
                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                    rows="2"
                    cols="40"
                ></textarea>
            </div>
        </div>
    );
}
