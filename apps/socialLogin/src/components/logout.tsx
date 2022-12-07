import axios from "axios";
import { useState, useEffect } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import GetCookie from "../hooks/getCookie";
import RemoveCookie from "../hooks/removeCookie";
import SetCookie from "../hooks/setCookie";
// const clientId =
//   "855361554866-s7p0pluushdetqk6rc3fvlnchtt33v8p.apps.googleusercontent.com";

const Logout = ({ setUser, setCode, setReload }: any) => {
  const [useData, setUseData] = useState<any>();
  // async function callBackend() {
  //   try {
  //     const response = await axios.get("http://localhost:3000/logout");
  //     console.log("XXXXXXXXX", response);
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  async function getTTokens(code: any) {
    try {
      const response = await axios.get("http://localhost:3000/login", {
        params: { code: code },
        withCredentials: true,
      });
      console.log("XXXXXXXXX", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  const removeCookies = () => {
    RemoveCookie("accessToken");
    RemoveCookie("refreshToken");
    console.log("Cookies Removed");
  };
  async function getData() {
    try {
      const accessToken = GetCookie("accessToken");
      const refreshToken = GetCookie("refreshToken");

      const response = await axios.get("http://localhost:3000/getData", {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      });
      console.log("data ", response.data);
      setUseData(response.data[0]);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        await getAccessToken();
        getData();
      }
      console.error(error?.response?.status);
    }
  }
  async function logTokens() {
    // const accessToken = Cookies.get("accessToken");
    const accessToken = GetCookie("accessToken");
    const refreshToken = GetCookie("refreshToken");
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    // try {
    //   const response = await axios.get("http://localhost:3000/getData");
    //   console.log("XDDDDDDDDDDDDD", response.data);
    //   setUseData(response.data);
    //   return response.data;
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const getTokkens = async () => {
    const res = await getTTokens(searchParams.get("code"));
    console.log("_--------= ", res);
  };
  const getAccessToken = async () => {
    RemoveCookie("accessToken");
    const refreshToken = GetCookie("refreshToken");
    const response = await axios.post("http://localhost:3000/token", {
      token: refreshToken,
    });
    if (response.data.accessToken)
      SetCookie("accessToken", response.data.accessToken);
    else {
      console.log("logout");
      logOut();
    }
    console.log(response);
  };

  const navigate = useNavigate();
  const logOut = () => {
    removeCookies();
    navigate("/login");
  };

  useEffect(() => {
    if (!GetCookie("refreshToken")) {
      getTokkens();
    }
  }, [useData]);

  return (
    <div>
      <Button
        type="primary"
        danger
        className="fixed right-2 top-2"
        onClick={() => logOut()}
      >
        <LogoutOutlined /> Log out
      </Button>
      <div className="flex justify-between w-2/3 mx-auto pb-6">
        {/* <Button
          type="primary"
          onClick={() => getTokkens()}
          className="text-blue-800 bg-orange-300"
        >
          Get tokens
        </Button> */}

        <Button
          type="primary"
          onClick={() => logTokens()}
          className="text-blue-800 bg-orange-300"
        >
          Log Cookies
        </Button>
        {/* <Button
          type="primary"
          onClick={() => removeCookies()}
          className="text-blue-800 bg-orange-300"
        >
          Remove Cookies
        </Button> */}
        <Button
          type="primary"
          onClick={() => getData()}
          className="text-blue-800 bg-orange-300"
        >
          Get Data
        </Button>

        {/* <Button
          type="primary"
          onClick={() => getAccessToken()}
          className="text-blue-800 bg-orange-300"
        >
          Get accT via rfsT
        </Button> */}
      </div>
      {useData && (
        <div>
          <div>{useData?.name}</div>
          <div>{useData?.email}</div>
        </div>
      )}
    </div>
  );
};

export default Logout;
