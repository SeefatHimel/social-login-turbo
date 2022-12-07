const { URLSearchParams } = require("url");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_INFO = "https://www.googleapis.com/oauth2/v2/userinfo";

const FACEBOOK_TOKEN = "https://graph.facebook.com/v4.0/oauth/access_token";
const FACEBOOK_USER_INFO = "https://graph.facebook.com/me";

const LINKEDIN_TOKEN = `https://www.linkedin.com/oauth/v2/accessToken`;
const LINKEDIN_NAME = "https://api.linkedin.com/v2/me";
const LINKEDIN_EMAIL =
  "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

const fetchJSON = (...args) => fetch(...args).then((r) => r.json());

module.exports = {
  getValidatedWithGoogleUser: async (code, redirectUri) => {
    const { access_token } = await fetchJSON(GOOGLE_TOKEN, {
      method: "POST",
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code,
      }),
    });
    const userData = await fetchJSON(GOOGLE_USER_INFO, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return userData;
  },
  getValidatedWithFacebookUser: async (code, redirectUri) => {
    const tokenUrl = getURLWithQueryParams(FACEBOOK_TOKEN, {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
    });
    const { access_token } = await fetchJSON(tokenUrl);
    const dataUrl = getURLWithQueryParams(FACEBOOK_USER_INFO, {
      fields: ["email", "name"].join(","),
      access_token,
    });
    const userData = await fetchJSON(dataUrl);
    return userData;
  },
  getValidatedWithLinkedinUser: async (code, redirectUri) => {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });
    const { access_token } = await fetchJSON(LINKEDIN_TOKEN, {
      method: "POST",
      body,
    });
    const payload = {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    };
    const { localizedFirstName, localizedLastName } = await fetchJSON(
      LINKEDIN_NAME,
      payload
    );
    const userData = {
      name: `${localizedFirstName} ${localizedLastName}`,
    };
    const response = await fetchJSON(LINKEDIN_EMAIL, payload);
    if (response.elements) {
      userData.email = response.elements[0]["handle~"].emailAddress;
    }

    return userData;
  },
};
const jwt = require("jsonwebtoken");

const generateAuthData = (id) => {
  const tokenExpirationTime =
    Math.floor(Date.now() / 1000) + process.env.JWT_LIFESPAN_IN_SECONDS;
  return {
    token: jwt.sign({ id, exp: tokenExpirationTime }, process.env.SECRET),
    tokenExpirationTime,
  };
};
