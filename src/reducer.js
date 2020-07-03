export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if ((friend.id = action.id)) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        accepted: true,
                    };
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (friend.id != action.id) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        accepted: false,
                    };
                }
            }),
        };
    }
    console.log("reducer: state.friends:", state);
    return state;
}
