import Card from "antd/es/card/Card";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import axios from "axios";
// import GoogleLogin from "react-google-login";
import GoogleButton from "react-google-button";
import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";

// const clientId =
//   "855361554866-s7p0pluushdetqk6rc3fvlnchtt33v8p.apps.googleusercontent.com";
export async function callBackend(code: string) {
  // clubId: string,
  // status?: string
  try {
    const response = await axios.get("http://localhost:3000/himel", {
      params: { code },
    });
    console.log("XXXXXXXXX", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function getAuthLink() {
  try {
    const response = await axios.get("http://localhost:3000/getLink");
    console.log("Auth url ", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

const Login = ({ user, setUser, setCode }: any) => {
  // const onSuccess = async (response: any) => {
  //   console.log("Log in Success ! Current User : ", response);
  //   if (response?.code) {
  //     console.log(">>", response.code);
  //     // setCode(response.code);
  //   }
  //   console.log(user?.name);

  //   if (!user?.name) {
  //     const res = await callBackend(response.code);
  //     console.log("$$$$$$$$$$$$$$", res);
  //     window.open(res?.data);
  //   }
  // };
  const getLink = async () => {
    const res = await getAuthLink();
    console.log("$$$$$$$$$$$$$$", res);
    window.open(res?.data);
  };
  return (
    <div>
      <div className="text-xl text-blue-500 p-6">First we have to log in</div>
      <div>
        <Card title="Credentials" bordered={false} style={{ width: 300 }}>
          <Input placeholder="Name" prefix={<UserOutlined />} />
          <Input placeholder="Email" prefix={<MailOutlined />} />
          <Input placeholder="Password" prefix={<KeyOutlined />} />
          <Button
            type="primary"
            className="text-blue-800 bg-orange-300 m-2 mx-auto"
          >
            Submit
          </Button>
        </Card>
      </div>
      <div className="p-6">
        <div className="text-blue-600 p-2">Log in with Google</div>
        <GoogleButton onClick={() => getLink()} />
      </div>
    </div>
  );
};
export default Login;
