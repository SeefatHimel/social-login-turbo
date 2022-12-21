import Card from "antd/es/card/Card";
import GoogleButton from "react-google-button";
import { getAuthLink } from "../../APIs";
import LoginForm from "./components/loginForm";

const Login = () => {
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
