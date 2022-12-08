import Cookie from "js-cookie";

const GetCookie = (cookieName, value) => {
  return Cookie.get(cookieName);
};

export default GetCookie;
