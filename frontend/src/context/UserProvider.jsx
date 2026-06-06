import { createContext, useEffect, useState } from "react";
import { getMe } from "../services/users";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await getMe();

      // Adjust based on backend response
      const loggedUser =
        response?.data?.data?.loggedInUser ||
        response?.data?.data ||
        response?.data;

      setUser(loggedUser || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading,setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;