import { Card } from "antd";
import Logout from "./logout";

const Home = () => {
  return (
    <div className="p-6 w-full h-max bg-slate-400">
      <div className="w-full ">
        <div className="text-center text-3xl folt-extrabold">Welcome</div>
        <div className="text-center text-lg folt-bold w-1/2 mx-auto">
          You have successfully logged in to our server. Below this you can see
          a button . Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Quam ducimus ut autem rem, nihil suscipit commodi aperiam expedita
          soluta repellat hic cumque. Similique, esse aut. Odit nihil dolorem
          alias consequuntur.
        </div>
      </div>
      <div className="ms-auto text-center pt-12">
        <Logout />
        This is Home Page
      </div>
    </div>
  );
};

export default Home;
