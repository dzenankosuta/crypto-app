import { createContext, useLayoutEffect, useState } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useLayoutEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  const values = {
    token,
    setToken,
  };
  return (
    <LoginContext.Provider value={values}>{children}</LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
