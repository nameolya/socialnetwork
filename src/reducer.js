export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friends: action.friends,
        };
    }

    console.log("state:", state);
    return state;
}
