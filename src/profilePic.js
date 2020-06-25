import React from "react";

export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    console.log(
        "props in ProfilePic first, last, imageUrl, toggleModal:",
        first,
        last,
        imageUrl,
        toggleModal
    );
    imageUrl = imageUrl || "/account1.png";
    let fullName = first + " " + last;
    return (
        <div>
            <img
                onClick={toggleModal}
                className="profile-pic"
                src={imageUrl}
                alt={fullName}
            />
        </div>
    );
}
