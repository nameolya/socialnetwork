import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/app/friends-wannabes");
    console.log("data from axios.get /app/friends-wannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data,
    };
}
