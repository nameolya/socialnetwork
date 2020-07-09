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

export function chatMessages(msgs) {
    return {
        type: "GET_MESSAGES",
        msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        msg,
    };
}

export async function receiveBuddies(id) {
    const { data } = await axios.get(`/app/buddies/${id}`);
    console.log("data from axios.get /app/buddies/:id", data);
    return {
        type: "GET_BUDDIES",
        buddies: data,
    };
}

export async function receiveConnections() {
    const { data } = await axios.get(`/app/buddies/`);
    console.log("data from axios.get /app/buddies/", data);
    return {
        type: "GET_CONNECTIONS",
        connections: data,
    };
}
