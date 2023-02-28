import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

const SessionContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState();

  const verifyToken = async (jwt) => {
     console.log("JWT",jwt)
    try {
      await axios.post("http://localhost:5005/auth/verify", undefined, {
        headers: {
            authorization: `Bearer ${jwt}`,
        },
      });
      setToken(jwt);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      window.localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const localToken = window.localStorage.getItem("token", token);
    console.log("LOCAL TOKEN: ", localToken)
    verifyToken(localToken);
  }, []);  
  
  useEffect(() => {
    console.log("TOKEN: ",token)
    if (token) {
      window.localStorage.setItem("token", token);

      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ setToken, isAuthenticated, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};



export default SessionContextProvider
