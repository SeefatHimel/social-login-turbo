const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");

const User = require("./user");
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
      console.log(e.mesaage);
    }
  }
}

app.use(cors());
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

async function getData() {
  if (oAuth2Client?.credentials?.access_token) {
    const oauth2Client2 = new google.auth.OAuth2(); // create new auth client
    oauth2Client2.setCredentials({
      access_token: oAuth2Client?.credentials?.access_token,
    }); // use the new auth client with the access_token
    const oauth2 = google.oauth2({
      auth: oauth2Client2,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get(); // get user info
    // console.log(data);
    return data;
  } else return null;
}

app.get("/getLink", (req, res) => {
  const authorizeUrl = getLink();
  // console.log("**** ", authorizeUrl);
  res.send(authorizeUrl);
});

app.get("/getToken", async (req, res) => {
  console.log("152", oAuth2Client);
  if (oAuth2Client?.credentials?.access_token) {
    res.send(oAuth2Client.credentials);
  } else {
    const tokens = await getTokens(req.query.code);
    // console.log("**** ", tokens);
    res.send(tokens);
  }
});

app.get("/auth", (req, res) => {
  res.send(req.query);
});

app.get("/getData", async (req, res) => {
  const dt = await getData();
  // console.log(">>>>>>>", dt?.name, dt?.email);
  await saveToDB(dt?.name, dt?.email);
  res.send(dt);
});

app.listen(3000, () => {
  console.log("server ruuning");
});
