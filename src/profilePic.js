import React from "react";

export default function ProfilePic({
    first,
    last,
    imageUrl,
    toggleModal,
    imageSize,
}) {
    console.log(
        "props in ProfilePic first, last, imageUrl, toggleModal,imagesize:",
        first,
        last,
        imageUrl,
        toggleModal,
        imageSize
    );
    imageUrl = imageUrl || "/account1.png";
    let fullName = first + " " + last;

    let profilePicClass;
    if (this.props.imageSize === "small") {
        profilePicClass = "small";
    } else {
        profilePicClass = "large";
    }

    return (
        <div>
            <img
                className={profilePicClass}
                onClick={toggleModal}
                src={imageUrl}
                alt={fullName}
            />
        </div>
    );
}
