import { createContext, useEffect, useLayoutEffect, useState } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
const crypto = require("crypto-js");

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const [currencies, setCurrencies] = useState([]);
  const [dataCurrencies, setDataCurrencies] = useState([]);

  const addToFavorites = (symbol) => {
    setDataCurrencies((prev) =>
      dataCurrencies.map((curr) => {
        if (curr.symbol === symbol) {
          curr.favorite = true;
          return curr;
        } else {
          return curr;
        }
      })
    );
  };

  const removeFromFavorites = (symbol) => {
    setDataCurrencies((prev) =>
      dataCurrencies.map((curr) => {
        if (curr.symbol === symbol) {
          curr.favorite = false;
          return curr;
        } else {
          return curr;
        }
      })
    );
  };

  useLayoutEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  useEffect(() => {
    // wss.onmessage = (msg) => console.log(msg.data);
    wss.onopen = () => {
      console.log("is open");
      // API keys setup here (See "Authenticated Channels")
      const apiKey = "hLH4a7Kk9rKMQcCWYx7cxv27Ol7xHW7wyeV0xqdkeIl";
      const apiSecret = "X4NxpR2HPEX8VhxcZYIJmhEPNgvQglvAZCMB1XEuaex";
      const authNonce = Date.now() * 1000;
      const authPayload = "AUTH" + authNonce;
      const authSig = crypto
        .HmacSHA384(authPayload, apiSecret)
        .toString(crypto.enc.Hex);

      const payload = {
        apiKey,
        authSig,
        authNonce,
        authPayload,
        event: "auth",
      };

      wss.send(JSON.stringify(payload));
    };
    fetch("/api/symbols")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.slice(0, 5).forEach((item) => {
          wss.send(JSON.stringify({ event: "subscribe", channel: item }));
        });
        // console.log(data);
        setCurrencies(data.slice(0, 5));
      });

    currencies.forEach((curr) => {
      fetch(`/api/pubticker/${curr}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.symbol = curr.toUpperCase();
          data.favorite = false;
          setDataCurrencies((prev) => [...prev, data]);
          // console.log(data);
        });
    });
    dataCurrencies.sort((a, b) => b.high - a.high);
  }, [currencies.length]);

  const values = {
    token,
    setToken,
    currencies,
    dataCurrencies,
    addToFavorites,
    removeFromFavorites,
  };
  console.log(dataCurrencies);
  return (
    <LoginContext.Provider value={values}>{children}</LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
