import Card from "antd/es/card/Card";
// import { Button, Input } from "antd";
import axios from "axios";
import GoogleButton from "react-google-button";
// import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import RegistrationForm from "./components/registrationForm";

export async function getAuthLink() {
  try {
    const response = await axios.get("http://localhost:3000/getLink");
    console.log("Auth url ", response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

const Registration = () => {
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
          <RegistrationForm />
        </Card>
        <div className="p-6">
          <div className="text-blue-600 p-2">Register with Google</div>
          <GoogleButton onClick={() => getLink()} />
        </div>
      </div>
    </div>
  );
};
export default Registration;
