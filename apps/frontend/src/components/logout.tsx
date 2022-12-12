import axios from "axios";
import { useState, useEffect } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import GetCookie from "../hooks/getCookie";
import RemoveCookie from "../hooks/removeCookie";
import SetCookie from "../hooks/setCookie";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const [useData, setUseData] = useState<any>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [searchParams] = useSearchParams();

  const removeCookies = () => {
    RemoveCookie("accessToken");
    RemoveCookie("refreshToken");
    console.log("Cookies Removed");
  };
  const logOut = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/logout}`
      );
      console.log(data);

      toast.success(data.message, {
        containerId: "top-right",
      });
    } catch (error) {}
    removeCookies();
    navigate("/login");
  };

  const getTokens = async () => {
    try {
      const refreshToken = await GetCookie("refreshToken");
      const code = await searchParams.get("code");
      if (refreshToken && !code) return;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/login}`,
        {
          params: { code: code },
          withCredentials: true,
        }
      );
      navigate("/");
      console.log("XXXXXXXXX", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      removeCookies();
      navigate("/login");
    }
  };
  const getAccessToken = async () => {
    RemoveCookie("accessToken");
    const refreshToken = GetCookie("refreshToken");
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/token}`,
      {
        token: refreshToken,
      }
    );
    if (response.data.accessToken)
      SetCookie("accessToken", response.data.accessToken);
    else {
      console.log("logout");
      logOut();
    }
    console.log(response);
  };

  async function getData() {
    try {
      const accessToken = GetCookie("accessToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getData}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
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
    const accessToken = GetCookie("accessToken");
    const refreshToken = GetCookie("refreshToken");
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
  }

  useEffect(() => {
    if (!GetCookie("refreshToken")) {
      getTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          onClick={() => getTokens()}
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
