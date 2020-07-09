const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/users"
);

module.exports.addAccount = (first, last, email, hashedPw) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first`,
        [first, last, email, hashedPw]
    );
};

module.exports.getHashedPw = (email) => {
    return db.query(`SELECT id, first, password FROM users WHERE email = $1`, [
        email,
    ]);
};

module.exports.getUserByEmail = (email) => {
    return db.query(`SELECT id, first, email FROM users WHERE email = $1`, [
        email,
    ]);
};

module.exports.addResetCode = (email, code) => {
    return db.query(`INSERT INTO reset_codes (email, code) VALUES ($1, $2)`, [
        email,
        code,
    ]);
};

module.exports.getCode = (code) => {
    return db.query(
        `SELECT * FROM reset_codes WHERE code = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [code]
    );
};

module.exports.updatePass = (email, password) => {
    return db.query(`UPDATE users SET password=$2 WHERE email=$1`, [
        email,
        password,
    ]);
};

module.exports.getUserById = (id) => {
    return db.query(
        `SELECT id, first, last, bio, imageUrl AS "imageUrl" FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.addUserPic = (imageUrl, id) => {
    return db.query(
        `UPDATE users SET imageUrl=$1 WHERE id=$2 RETURNING imageUrl AS "imageUrl"`,
        [imageUrl, id]
    );
};

module.exports.addUserBio = (bio, id) => {
    return db.query(`UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio`, [
        bio,
        id,
    ]);
};

module.exports.getLatestUsers = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 6;`);
};

module.exports.getUserByName = (name) => {
    return db.query(
        `SELECT id, first, last, bio, imageUrl FROM users WHERE first ILIKE $1 OR last ILIKE $1 LIMIT 6;`,
        [name + "%"]
    );
};

module.exports.getFriendshipStatusById = (person, user) => {
    return db.query(
        `SELECT * FROM friendships WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1);`,
        [person, user]
    );
};

module.exports.acceptFriendRequest = (person, user) => {
    return db.query(
        `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2;`,
        [person, user]
    );
};

module.exports.Unfriend = (person, user) => {
    return db.query(
        `DELETE FROM friendships WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1);`,
        [person, user]
    );
};

module.exports.addFriendRequest = (person, user) => {
    return db.query(
        `INSERT INTO friendships (sender_id, receiver_id) VALUES ($2, $1);`,
        [person, user]
    );
};

module.exports.checkFriendRequest = (person, user) => {
    return db.query(
        `SELECT * FROM friendships WHERE sender_id=$2 AND receiver_id=$1;`,
        [person, user]
    );
};

module.exports.getFriendsById = (user) => {
    return db.query(
        `SELECT users.id, first, last, imageUrl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [user]
    );
};

module.exports.getLastTenMsgs = () => {
    return db.query(
        `SELECT users.id, first, last, imageUrl, chats.created_at, text FROM users INNER JOIN chats ON users.id=chats.poster_id ORDER BY chats.created_at DESC LIMIT 10;`
    );
};

module.exports.addNewMsg = (id, message) => {
    return db.query(
        `INSERT INTO chats (poster_id, text) VALUES ($1, $2) RETURNING id;`,
        [id, message]
    );
};

module.exports.getNewMsg = (id) => {
    return db.query(
        `SELECT users.id, first, last, imageUrl, chats.created_at, text FROM users INNER JOIN chats ON users.id=chats.poster_id WHERE chats.id=$1;`,
        [id]
    );
};

module.exports.getBuddiesById = (user) => {
    return db.query(
        `SELECT users.id, first, last, imageUrl
  FROM friendships
  JOIN users
  ON (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [user]
    );
};

module.exports.getMutualsById = (other, user) => {
    return db.query(
        `SELECT users.id, first, last, imageUrl
  FROM friendships
  JOIN users
  ON (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,

        `SELECT users.id, first, last, imageUrl
  FROM friendships
  JOIN users
  ON (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`[
            (other, user)
        ]
    );
};
