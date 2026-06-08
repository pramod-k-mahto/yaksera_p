import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

function ProtectedRoutes({comp}) {
  const navigate = useNavigate();
  const { loading, user } = useContext(UserContext);

  const role = user?.role;
  // console.log(role)
useEffect(() => {
  if (!loading && !user) {
    navigate("/login", { replace: true });
  } else if (!loading && user && role !== "admin") {
    navigate("/", { replace: true }); // non-admin goes home
  }
}, [loading, user, role, navigate]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold bg-black text-white">
      Loading...
    </div>
  );
}

if (!user || role !== "admin") return null;

return comp;
}

export default ProtectedRoutes;