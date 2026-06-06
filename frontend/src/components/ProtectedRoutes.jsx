import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
function ProtectedRoutes({ comp }) {
  const navigate = useNavigate();
  const { loading, user } = useContext(UserContext);
  // console.log(user);
  const role = user?.role;
  useEffect(() => {
    if (!loading && role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [loading, navigate]);

  if (user == null && loading) {
    return (
      <div className="text-white   bg-black font-bold  text-4xl p-10">
        Loading...
      </div>
    );
  } else {
    return comp;
  }
}

export default ProtectedRoutes;
