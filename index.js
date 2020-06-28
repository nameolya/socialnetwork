const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const multer = require("multer"); //npm pkg for handling multipart/form data on server side, adds the file and the body to the request object
const uidSafe = require("uid-safe"); // npm pkg that generates random and unique string
const path = require("path"); // core module, helps with handling files by providing path
const s3 = require("./s3");
const s3Url = require("./config.json");

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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.get("/user", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.session.userID:", req.session.userID);
    db.getUserById(req.session.userID)
        .then((results) => {
            console.log("results.rows[0]:", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getUserById:", err);
            res.sendStatus(500);
        });
});

app.get("/user/:id.json", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.session.userID:", req.session.userID);
    if (req.session.userID == req.params.id) {
        res.json({ isSelf: true });
    } else {
        db.getUserById(req.params.id)
            .then((results) => {
                console.log("results.rows[0]:", results.rows[0]);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error in getUserById:", err);
                res.sendStatus(500);
            });
    }
});

///---ADD--BIO---
app.post("/user/edit-bio", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    console.log("req.body /user/edit-bio:", req.body);

    db.addUserBio(req.body.draftbio, req.session.userID)
        .then((results) => {
            console.log("addUserBio results.rows[0]:", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err in addUserBio:", err);
            res.sendStatus(500);
        });
});

///---ADD--PROFILE--PIC
app.post(
    "/user/pic-upload",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        console.log(`ran ${req.method} at ${req.url} route`);
        console.log("req.file:", req.file);
        console.log("s3Url:", s3Url);
        console.log("req.file.filename:", req.file.filename);

        let s3UrlProperty;
        s3UrlProperty = s3Url.s3Url;
        db.addUserPic(
            `${s3UrlProperty}${req.file.filename}`,
            req.session.userID
        )
            .then((results) => {
                console.log("addUserPic results.rows[0]:", results.rows[0]);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("err in addUserPic:", err);
                res.sendStatus(500);
            });
    }
);

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
                            console.log(
                                "req.session.userID:",
                                req.session.userID
                            );
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

app.get("*", (req, res) => {
    console.log(`ran ${req.method} at ${req.url} route`);
    if (!req.session.userID) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, () => {
    console.log("I'm listening.");
});
