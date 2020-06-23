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
