const keys = require("./data/oauth2.keys.json");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
// const http = require("http");
// const url = require("url");
// const destroyer = require("server-destroy");
// const open = require("open");

const express = require("express");

const cors = require("cors");

const app = express();

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

// function getAuthenticatedClient(code) {
//   return new Promise((resolve, reject) => {
//     // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
//     // which should be downloaded from the Google Developers Console.
//     // console.log(keys);

//     // Generate the url that will be used for the consent dialog.
//     const oAuth2Client = new OAuth2Client(
//       keys.web.client_id,
//       keys.web.client_secret,
//       keys.web.redirect_uris[0]
//     );
//     const authorizeUrl = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: "https://www.googleapis.com/auth/userinfo.profile",
//     });
//     console.log("38>>> ", authorizeUrl);
//     resolve(authorizeUrl);
//     return authorizeUrl;
//     // Open an http server to accept the oauth callback. In this simple example, the
//     // only request to our webserver is to /oauth2callback?code=<code>
//     const server = http
//       .createServer(async (req, res) => {
//         console.log(">>>>>>>>>>>>>>", req.url);
//         try {
//           console.log(">>>>>>>>>>>>>>", req.url);
//           if (1) {
//             // acquire the code from the querystring, and close the web server.
//             // const qs = new url.URL(req.url, "http://localhost:3000")
//             //   .searchParams;
//             // const code = qs.get("code");
//             console.log(`Code is ${code}`);
//             res.end("Authentication successful! Please return to the console.");
//             server.destroy();

//             // Now that we have the code, use that to acquire tokens.
//             const r = await oAuth2Client.getToken(code);
//             // Make sure to set the credentials on the OAuth2 client.
//             oAuth2Client.setCredentials(r.tokens);
//             console.info("Tokens acquired.");
//             resolve(oAuth2Client);
//           }
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .listen(3001, () => {
//         console.log("67>>> ", authorizeUrl);
//         // open the browser to the authorize url to start the workflow
//         open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
//       });
//     destroyer(server);
//   });
// }
// async function test(code) {
//   // const oAuth2Client = await getAuthenticatedClient(code);
//   const authorizeUrl = await getAuthenticatedClient(code);
//   console.log("76 >>> ", authorizeUrl);
//   // resolve(authorizeUrl);

//   return authorizeUrl;
//   // Make a simple request to the People API using our pre-authenticated client. The `request()` method
//   // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
//   const url = "https://people.googleapis.com/v1/people/me?personFields=names";
//   const res = await oAuth2Client.request({ url });
//   console.log("80>>> ", res.data);

//   // After acquiring an access_token, you may want to check on the audience, expiration,
//   // or original scopes requested.  You can do that with the `getTokenInfo` method.
//   const tokenInfo = await oAuth2Client.getTokenInfo(
//     oAuth2Client.credentials.access_token
//   );
//   console.log(tokenInfo);
// }
async function getTokens(code) {
  console.log("98 ", code);
  // const oAuth2Client = new OAuth2Client(
  //   keys.web.client_id,
  //   keys.web.client_secret,
  //   keys.web.redirect_uris[0]
  // );
  const r = await oAuth2Client.getToken(code);
  // Make sure to set the credentials on the OAuth2 client.
  console.log("101 ", r);
  oAuth2Client.setCredentials(r.tokens);
  console.info("Tokens acquired.");
  return oAuth2Client;
}

function getLink() {
  // const oAuth2Client = new OAuth2Client(
  //   keys.web.client_id,
  //   keys.web.client_secret,
  //   keys.web.redirect_uris[0]
  // );

  // Generate the url that will be used for the consent dialog.
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
  const oauth2Client2 = new google.auth.OAuth2(); // create new auth client
  oauth2Client2.setCredentials({
    access_token: oAuth2Client?.credentials?.access_token,
  }); // use the new auth client with the access_token
  const oauth2 = google.oauth2({
    auth: oauth2Client2,
    version: "v2",
  });
  const { data } = await oauth2.userinfo.get(); // get user info
  console.log(data);
  return data;
}
// test().catch(console.error);
// app.get("/himel", async (req, res) => {
//   const authorizeUrl = await test(req.query.code);
//   console.log("**** ", authorizeUrl);
//   res.send(authorizeUrl);
// });
// app.get("/logout", (req, res) => {
//   console.log("logged out");
//   destroyer(server);
//   res.send(req.query);
// });

app.get("/getLink", (req, res) => {
  const authorizeUrl = getLink();
  console.log("**** ", authorizeUrl);
  res.send(authorizeUrl);
});

app.get("/getToken", async (req, res) => {
  console.log("152", oAuth2Client);
  if (oAuth2Client?.credentials?.access_token) {
    res.send(oAuth2Client.credentials);
  } else {
    const tokens = await getTokens(req.query.code);
    console.log("**** ", tokens);
    // res.send(req.query.code);
    res.send(tokens);
  }
});
app.post("/himel", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.get("/auth", (req, res) => {
  res.send(req.query);
});

app.get("/getData", async (req, res) => {
  const dt = await getData();
  res.send(dt);
});

app.listen(3000, () => {
  console.log("server ruuning");
});
