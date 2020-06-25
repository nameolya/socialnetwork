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
        `SELECT first, last, imageUrl AS "imageUrl" FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.addUserPic = (imageUrl, id) => {
    return db.query(
        `UPDATE users SET imageUrl=$1 WHERE id=$2 RETURNING imageUrl AS "imageUrl"`,
        [imageUrl, id]
    );
};
