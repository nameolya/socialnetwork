const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");

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

app.listen(8080, () => {
    console.log("I'm listening.");
});
