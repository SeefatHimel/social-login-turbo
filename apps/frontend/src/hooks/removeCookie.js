import Cookie from "js-cookie";

const RemoveCookie = (cookieName, value) => {
  Cookie.remove(cookieName);
};

export default RemoveCookie;
