import React, { createContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch(
        "https://6555573184b36e3a431db63e.mockapi.io/config"
      );
      const data = await response.json();
      setConfig(data[0]);
    };

    fetchConfig();

    const interval = setInterval(fetchConfig, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export default ConfigContext;
