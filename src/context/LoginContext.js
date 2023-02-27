import { createContext, useEffect, useLayoutEffect, useState } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/20061");
const crypto = require("crypto-js");

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const [currencies, setCurrencies] = useState([]);
  const [dataCurrencies, setDataCurrencies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (symbol) => {
    setFavorites((prev) => [...prev, symbol]);
  };

  const removeFromFavorites = (symbol) => {
    setFavorites((prev) => prev.filter((item) => item !== symbol));
  };

  const refreshCurrenciesData = () => {
    const promises = [];
    currencies.forEach((curr) => {
      const resultForItem = fetch(`/api/pubticker/${curr}`);
      promises.push(resultForItem);
    });
    Promise.all(promises)
      .then((res) => {
        return Promise.all(res.map((r) => r.json()));
      })
      .then((data) => {
        const currencyData = data.map((item, index) => ({
          ...item,
          symbol: currencies[index].toUpperCase(),
        }));
        setDataCurrencies(currencyData.sort((a, b) => b.high - a.high));
      });
  };

  useLayoutEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  useEffect(() => {
    wss.onopen = () => {
      console.log("Socket connection is open");
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

      let topCurrencies = [];

      fetch("/api/symbols")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          topCurrencies = data.slice(0, 5);

          topCurrencies.forEach((item) => {
            wss.send(
              JSON.stringify({
                event: "subscribe",
                symbol: `t${item.toUpperCase()}`,
                channel: "ticker",
              })
            );
          });

          setCurrencies(topCurrencies);
          const promises = [];
          topCurrencies.forEach((curr) => {
            const resultForItem = fetch(`/api/pubticker/${curr}`);
            promises.push(resultForItem);
          });
          return Promise.all(promises);
        })
        .then((res) => {
          return Promise.all(res.map((r) => r.json()));
        })
        .then((data) => {
          const currencyData = data.map((item, index) => ({
            ...item,
            symbol: topCurrencies[index].toUpperCase(),
          }));
          setDataCurrencies(currencyData.sort((a, b) => b.high - a.high));
        });
    };
  }, []);

  useEffect(() => {
    if (currencies.length) {
      wss.onmessage = (msg) => {
        refreshCurrenciesData();
        // For example I search for the way on changing some property to rendering just that currency.
        // But on change I get something like this:
        // [268054,23348,45.90767033,23349,38.79927478,-301,-0.01272727,23349,1906.93730734,23891,23131]
        // I acually
        console.log(msg.data);
      };
    }
  }, [currencies]);

  const values = {
    token,
    setToken,
    currencies,
    dataCurrencies,
    addToFavorites,
    removeFromFavorites,
    favorites,
  };
  return (
    <LoginContext.Provider value={values}>{children}</LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
