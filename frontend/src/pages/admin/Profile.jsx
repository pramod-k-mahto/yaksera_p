import { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import { logout } from "../../services/users";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const { loading, setUser, user } = useContext(UserContext);
  // console.log(user);
 
  const logoutUser = async () => {
    let data = await logout();
    // console.log(data);
    // console.log(data);
    if (data?.status == 200) {
      return navigate("/login"); // Redirect to admin dashboard after successful login
    }
    setUser(null);
    alert(data?.message);
  };

   if (!user && loading) {
    return <div className="p-10">Loading profile...</div>;
  }
  return (
    <div className="relative mt-5">
      {/* Cover Image */}
      <div
        className="h-[300px] w-full bg-center bg-cover opacity-40"
        style={{
          backgroundImage: `url(${user?.coverImage || "/default-cover.jpg"})`,
        }}
      ></div>

      {/* Profile Section */}
      <div className="relative -mt-16 flex flex-col items-center">
        <img
          className="w-32 h-32 rounded-full border-4 border-white object-cover"
          src={user?.profile || "/default-avatar.png"}
          alt="profile"
        />

        <div className="mt-4 text-center space-y-1">
          <h1 className="text-xl font-semibold">{user?.name}</h1>
          <p className="text-gray-600">{user?.phone || "N/A"}</p>
          <p className="text-gray-600 capitalize">{user?.role || "user"}</p>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <button
          onClick={() => {
            logoutUser();
          }}
          className="bg-red-700 p-2 rounded-sm mt-3 px-5"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
