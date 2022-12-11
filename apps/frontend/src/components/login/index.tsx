import Card from "antd/es/card/Card";
// import Input from "antd/es/input/Input";
// import { Button, Input } from "antd";
import axios from "axios";
// import GoogleLogin from "react-google-login";
import GoogleButton from "react-google-button";
// import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
// import { useRef } from "react";
import LoginForm from "./components/loginForm";

// const clientId =
//   "855361554866-s7p0pluushdetqk6rc3fvlnchtt33v8p.apps.googleusercontent.com";

export async function getAuthLink() {
  try {
    const response = await axios.get("http://localhost:3000/getLink");
    console.log("Auth url ", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

const Login = () => {
  // const name = useRef();
  // const email = useRef();
  // const password = useRef();
  // const handleSubmit = () => {
  //   console.log("submit");
  // };
  const getLink = async () => {
    const res = await getAuthLink();
    console.log("$$$$$$$$$$$$$$", res);
    window.open(res?.data);
  };
  return (
    <div>
      <div className="text-xl text-blue-500 p-6">First we have to log in</div>
      <div className="w-2/3 mx-auto">
        <Card title="Credentials" bordered={false}>
          <LoginForm />
        </Card>
        <div className="p-6">
          <div className="text-blue-600 p-2">Log in with Google</div>
          <GoogleButton onClick={() => getLink()} />
        </div>
      </div>
    </div>
  );
};
export default Login;
