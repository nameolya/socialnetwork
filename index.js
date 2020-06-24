const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

let secret;
if (process.env.PORT) {
    secret = process.env.secret;
} else {
    secret = require("./secrets").secret;
}

app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.static("public"));

app.use(compression());

app.use(express.json());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    if (req.session.userID) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    if (!req.session.userID) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
///---RESET--(1)----

app.post("/reset/start", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.body /reset/start:", req.body);
    if (req.body.email) {
        db.getUserByEmail(req.body.email)
            .then((results) => {
                if (results.rows[0]) {
                    console.log("results.rows[0]", results.rows[0]);
                    const secretCode = cryptoRandomString({ length: 6 });
                    console.log("secretCode:", secretCode);
                    Promise.all([
                        ses.sendEmail(
                            results.rows[0].email,
                            results.rows[0].first,
                            secretCode
                        ),
                        db.addResetCode(results.rows[0].email, secretCode),
                    ]).then(() => {
                        res.json({ success: true });
                    });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("error in addAccount:", err);
                res.json({ success: false });
            });
    } else {
        console.log("the form is not filled in properly");
        res.json({ success: false });
    }
});
///---RESET-(2)---

app.post("/reset/verify", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.body /reset/verify:", req.body);
    if (req.body.code && req.body.password) {
        db.getCode(req.body.code)
            .then((results) => {
                if (results.rows[0]) {
                    hash(req.body.password)
                        .then((hashedPw) => {
                            db.updatePass(results.rows[0].email, hashedPw);
                        })
                        .then(() => {
                            res.json({ success: true });
                        });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("error in getCode:", err);
                res.json({ success: false });
            });
    } else {
        console.log("the form is not filled in properly");
        res.json({ success: false });
    }
});

////---- REGISTER---
app.post("/register", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.body /register:", req.body);
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        hash(req.body.password)
            .then((hashedPw) => {
                db.addAccount(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPw
                )
                    .then((results) => {
                        console.log("new record added");
                        req.session.userID = results.rows[0].id;
                        req.session.userName = results.rows[0].first;
                        console.log("req.session:", req.session);
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in addAccount:", err);
                        res.json({ success: false });
                    });
            })
            .catch((err) => {
                console.log("error in hash:", err);
                res.json({ success: false });
            });
    } else {
        console.log("the form is not filled in properly");
        res.json({ success: false });
    }
});

///---LOG IN----

app.post("/login", (req, res) => {
    console.log("req.session.userID:", req.session.userID);
    console.log(`ran ${req.method} at ${req.url} route`);
    if (req.body.email && req.body.password) {
        db.getHashedPw(req.body.email)
            .then((results) => {
                console.log("hashed password and id:", results);
                compare(req.body.password, results.rows[0].password).then(
                    (match) => {
                        console.log("match yes/no:", match);
                        if (match) {
                            req.session.userID = results.rows[0].id;
                            req.session.userName = results.rows[0].first;
                            console.log("req.session:", req.session);
                            res.json({ success: true });
                        } else {
                            console.log("password doesn't match");
                            res.json({ success: false });
                        }
                    }
                );
            })
            .catch((err) => {
                console.log("error in getHashedPw", err);
                res.json({ success: false });
            });
    } else {
        console.log("the form is not filled in properly");
        res.json({ success: false });
    }
});

app.listen(8080, () => {
    console.log("I'm listening.");
});
