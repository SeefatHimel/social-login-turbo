import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import SetCookie from "../../../hooks/setCookie";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const signIn = async (values: any) => {
    console.log(values);
    try {
      const { data } = await axios.post("http://localhost:3000/signIn", {
        email: values.email,
        password: values.password,
      });
      console.log(data);
      SetCookie("accessToken", data.accessToken);
      SetCookie("refreshToken", data.refreshToken);
      toast.success(data?.message, {
        containerId: "top-right",
      });
      navigate("/home");
    } catch (error: any) {
      const { data } = error.response;

      toast.error(data?.message, {
        containerId: "top-right",
      });
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    await signIn(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          {
            type: "email",
            min: 0,
            max: 200,
            message: "Please input a valid email.",
          },
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" className="bg-red-500">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
