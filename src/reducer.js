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
                if (friend.id != action.id) {
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
                        unfriended: true,
                    };
                }
            }),
        };
    }
    console.log("state after unfriended:", state);

    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            messages: action.msgs,
        };
    }
    console.log("state after GET_MESSAGES:", state);

    if (action.type == "ADD_MESSAGE") {
        state = {
            ...state,
            messages: [action.msg, ...state.messages],
        };
    }
    console.log("state after ADD_MESSAGE:", state);

    if (action.type == "GET_BUDDIES") {
        state = {
            ...state,
            buddies: action.buddies,
        };
    }

    console.log("state after GET_BUDDIES:", state);

    if (action.type == "GET_CONNECTIONS") {
        state = {
            ...state,
            connections: action.connections,
        };
    }

    console.log("state after GET_CONNECTIONS:", state);

    return state;
}
