import { useState, useEffect } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import GetCookie from "../hooks/getCookie";
import { GetData, GetTokens, LogOut } from "../APIs";

const Logout = () => {
  const navigate = useNavigate();
  const [useData, setUseData] = useState<any>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [searchParams] = useSearchParams();

  const handleLogOut = async () => {
    if (await LogOut()) navigate("/login");
  };

  const getTokens = async () => {
    const refreshToken = await GetCookie("refreshToken");

    const code = await searchParams.get("code");
    if (refreshToken && !code) return;

    const res = await GetTokens(code!);
    if (res) navigate("/");
    else navigate("/login");
  };

  async function getData() {
    const res: any = await GetData();
    if (res && res[0]) setUseData(res[0]);
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
        onClick={() => handleLogOut()}
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
