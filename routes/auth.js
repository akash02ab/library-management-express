const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const router = express.Router();
const userController = require("../controllers/userController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "static/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const multipart = multer({ storage: storage });

const refreshTokens = [];

const verifyToken = (req, res, next) => {
    // Get auth header value
    console.log(req.headers);
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader);
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        // Split at the space
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.status(403).json({ error: "Token not found" });
    }
};

router.post("/signup", multipart.single("avatar"), async (req, res) => {
    req.body.avatar = req.file.filename;

    let response = await userController.addNewUser(req.body);

    if (response.status) {
        res.status(201).json(response.result);
    } else {
        res.status(401).json(response.result);
    }
});

router.post("/signin", async (req, res) => {
    let loginResult = await userController.signIn(req.body);

    if (loginResult.status) {
        const payload = {
            email: loginResult.result.email,
            time: Date.now(),
        };

        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
        });

        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
        });

        refreshTokens.push(refreshToken);

        res.status(201).json({ access_token: accessToken, refresh_token: refreshToken });
    } else {
        res.status(401).json(loginResult.result);
    }
});

router.post('/token', async (req, res) => {
    const { token , email } = req.body;
    console.log(req.body)
    if(!token || !refreshTokens.includes(token)) {
        return res.status(401).json({error: "Access Denied"});
    }

    let payload = {
        email,
    }

    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
    });

    res.status(200).json({access_token: accessToken});
});

module.exports = { router, verifyToken };
