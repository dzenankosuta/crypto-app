import { createContext, useEffect, useLayoutEffect, useState } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/20061");
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

      wss.onmessage = (msg) => console.log({ msg });

      fetch("/api/symbols")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.slice(0, 5).forEach((item) => {
            wss.send(JSON.stringify({ event: "subscribe", channel: item }));
          });
          wss.addEventListener("message", (data) => {
            console.log("Slusali smo ovo", JSON.parse(data.data));
          });
          const topCurrencies = data.slice(0, 5);
          setCurrencies(topCurrencies);
          const promises = [];
          topCurrencies.forEach((curr) => {
            const resultForItem = fetch(`/api/pubticker/${curr}`);
            promises.push(resultForItem);
          });
          Promise.all(promises)
            .then((res) => {
              return Promise.all(res.map((r) => r.json()));
            })
            .then((data) => {
              console.log({ data });
              const currencyData = data.map((item, index) => ({
                ...item,
                symbol: topCurrencies[index].toUpperCase(),
                favorite: false,
              }));
              setDataCurrencies(currencyData.sort((a, b) => b.high - a.high));
            });
        });
    };
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
