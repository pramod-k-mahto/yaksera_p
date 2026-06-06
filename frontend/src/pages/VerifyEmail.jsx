import { NavLink, useParams } from "react-router-dom";
import { verifyEmail } from "../services/users";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const [data, setData] = useState({});

  const { token } = useParams();

  const verify = async () => {
    let res = await verifyEmail(token);
    console.log(res);
    setData(res);
  };

  useEffect(() => {
    verify();
  }, [token]);
  return (
    <div className="p-10  text-green-500 w-96 m-auto bg-gray-100 flex justify-center flex-col items-center  my-10 ">
      <h1>{data.message}</h1>
      <NavLink>Home </NavLink>
    </div>
  );
}

export default VerifyEmail;
