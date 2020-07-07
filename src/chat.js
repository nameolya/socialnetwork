import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.messages);

    console.log("here are my last 10 chat messages: ", chatMessages);

    // you'll want to run this everytime we get a newChatMsg - you need to pass something to the array
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

    return (
        <div className="chat">
            <div className="chat-title">
                <h1>Welcome to Chat</h1>
            </div>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((elem, idx) => {
                        return (
                            <div key={idx}>
                                <div>
                                    <div className="profile-image">
                                        <img
                                            className="small"
                                            src={elem.imageurl}
                                            onClick={(e) =>
                                                routeChange(`${elem.id}`)
                                            }
                                        />
                                    </div>
                                </div>
                                //messages here
                                {elem.first}
                                {elem.last}
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
