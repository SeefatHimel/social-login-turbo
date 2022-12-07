const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const mongoose = require("mongoose");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./user");
const UserTokens = require("./userTokens");
const keys = require("./data/oauth2.keys.json");

const app = express();

mongoose.connect(
  "mongodb://localhost/socialLogin",
  () => {
    console.log("mongodb connected");
  },
  (e) => console.error(e)
);

async function saveToDB(name, email) {
  const oldUser = await User.where("email").equals(email);
  console.log(oldUser[0]);
  if (oldUser[0]) {
    console.log("User already Exists");
  } else {
    try {
      const user = await User.create({ name: name, email: email });
      console.log("User Added ", user);
    } catch (e) {
      console.log(e.message);
    }
  }
}
async function saveRefreshToken(email, refresh_token) {
  const oldToken = await UserTokens.where("refresh_token").equals(
    refresh_token
  );
  console.log(oldToken);
  if (oldToken[0]) {
    console.log("Token already Exists");
  } else {
    try {
      const newToken = await UserTokens.create({
        email: email,
        refresh_token: refresh_token,
      });
      console.log("Token Added ", newToken);
    } catch (e) {
      console.log(e.message);
    }
  }
}
const corsOptions = {
  origin: true, //included origin as true

  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ hello: "hello" });
});
const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

async function getTokens(code) {
  // console.log("98 ", code);
  // console.log("99 ", oAuth2Client);
  const r = await oAuth2Client.getToken(code);
  // Make sure to set the credentials on the OAuth2 client.
  // console.log("101 ", r);
  oAuth2Client.setCredentials(r.tokens);
  console.info("Tokens acquired.");
  return oAuth2Client;
}

function getLink() {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile", // get user info
      "https://www.googleapis.com/auth/userinfo.email", // get user email ID and if its verified or not
    ],
  });
  return authorizeUrl;
}
function generateAccessToken(user, email) {
  return jwt.sign(
    {
      user,
      email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "25s" }
  );
}
async function getUserData(access_token) {
  const oauth2Client2 = new google.auth.OAuth2(); // create new auth client
  oauth2Client2.setCredentials({
    access_token: access_token,
  }); // use the new auth client with the access_token
  const oauth2 = google.oauth2({
    auth: oauth2Client2,
    version: "v2",
  });
  const { data } = await oauth2.userinfo.get(); // get user info

  return data;
}
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log("123", refreshToken);
  if (refreshToken == null) return res.sendStatus(401);
  const refreshTokens = UserTokens.where("refresh_token").equals(refreshToken);
  if (refreshTokens[0]) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
app.get("/getLink", (req, res) => {
  const authorizeUrl = getLink();
  // console.log("**** ", authorizeUrl);
  res.send(authorizeUrl);
});

app.get("/login", async (req, res) => {
  if (!oAuth2Client?.credentials?.access_token) {
    const tokens = await getTokens(req.query.code);
    // console.log("**** ", tokens);
  }
  const userData = await getUserData(oAuth2Client?.credentials?.access_token);
  if (userData) {
    try {
      await saveToDB(userData?.name, userData?.email);
      const accessToken = generateAccessToken({
        user: userData?.name,
        email: userData?.email,
      });
      const refreshToken = jwt.sign(
        {
          user: userData?.name,
          email: userData?.email,
        },
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log({ accessToken: accessToken, refreshToken: refreshToken });
      saveRefreshToken(userData?.email, refreshToken);
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      res.send({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
      console.error(error.message);
      res.send([]);
    }
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log("err", err);
    console.log("data", data);
    console.log("req.user", req.user);
    if (err) return res.sendStatus(403);
    req.user = data.user.user;
    // console.log("req", req);
    console.log("req.user", req.user);

    next();
  });
}
// app.get("/getToken", async (req, res) => {
//   console.log("152", oAuth2Client);
//   if (oAuth2Client?.credentials?.access_token) {
//     res.send(oAuth2Client.credentials);
//   } else {
//     const tokens = await getTokens(req.query.code);
//     // console.log("**** ", tokens);
//     res.send(tokens);
//   }
// });

// app.get("/auth", (req, res) => {
//   res.send(req.query);
// });

async function getDataFromDB() {
  const allData = await User.find();
  return allData;
}

app.get("/getData", authenticateToken, async (req, res) => {
  console.log("in data");
  const dt = await getDataFromDB();
  console.log("dt>>> ", dt);
  // console.log(">>>>>>>", dt?.name, dt?.email);
  res.send(dt);
});

app.listen(3000, () => {
  console.log("server running");
});
