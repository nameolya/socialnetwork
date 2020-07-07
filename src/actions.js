import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/app/friends-wannabes");
    console.log("data from axios.get /app/friends-wannabes", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data,
    };
}

export async function acceptFriendRequest(id) {
    await axios.post(`/app/Accept-Friend-Request/${id}`);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function unfriend(id) {
    await axios.post(`/app/Unfriend/${id}`);
    return {
        type: "UNFRIEND",
        id,
    };
}

export function getMessages(messages) {
    return {
        type: "GET_MESSAGES",
        messages,
    };
}
