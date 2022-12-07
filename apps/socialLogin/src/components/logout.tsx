import axios from "axios";
import { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

// import { GoogleLogout } from "react-google-login";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
// const clientId =
//   "855361554866-s7p0pluushdetqk6rc3fvlnchtt33v8p.apps.googleusercontent.com";

const Logout = ({ setUser, setCode, setReload }: any) => {
  const [useData, setUseData] = useState<any>();
  async function callBackend() {
    try {
      const response = await axios.get("http://localhost:3000/logout");
      console.log("XXXXXXXXX", response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async function getTTokens(code: any) {
    try {
      const response = await axios.get("http://localhost:3000/getToken", {
        params: { code: code },
      });
      console.log("XXXXXXXXX", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async function getData() {
    try {
      const response = await axios.get("http://localhost:3000/getData");
      console.log("XDDDDDDDDDDDDD", response.data);
      setUseData(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const getTokkens = async () => {
    console.log("<><><><><>", searchParams.get("code"));
    const res = await getTTokens(searchParams.get("code"));
    console.log("_--------= ", res);
  };

  const navigate = useNavigate();

  // const onSuccess = () => {
  //   console.log("Loged out Successfully");
  //   callBackend();
  //   setUser([]);
  //   setReload(true);
  //   navigate("/login");
  // };
  return (
    <div>
      <Button
        type="primary"
        danger
        className="fixed right-2 top-2"
        onClick={() => navigate("/login")}
      >
        <LogoutOutlined /> Log out
      </Button>
      <Button
        type="primary"
        onClick={() => getTokkens()}
        className="text-blue-800 bg-orange-300"
      >
        Get tokens
      </Button>

      <Button
        type="primary"
        onClick={() => getData()}
        className="text-blue-800 bg-orange-300"
      >
        Get Data
      </Button>
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
