import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <>
      <DataContext.Provider
        value={{
          user,
          setUser,
          tasks,
          setTasks,
        }}
      >
        {children}
      </DataContext.Provider>
    </>
  );
};

export const DataState = () => {
  return useContext(DataContext);
};

export default DataProvider;
