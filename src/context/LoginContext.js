import { createContext, useEffect, useLayoutEffect, useState } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/20061");
const crypto = require("crypto-js");

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const [currencies, setCurrencies] = useState([]);
  const [dataCurrencies, setDataCurrencies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currencyPairsData, setCurrencyPairsData] = useState([]);

  const addToFavorites = (symbol) => {
    setFavorites((prev) => [...prev, symbol]);
    localStorage.setItem("favorites", JSON.stringify([...favorites, symbol]));
  };

  const removeFromFavorites = (symbol) => {
    setFavorites((prev) => prev.filter((item) => item !== symbol));
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.filter((fav) => fav !== symbol))
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
  }, [currencies.length]);

  useEffect(() => {
    wss.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (Array.isArray(data)) {
        if (data[0] !== 0 && !data.includes("hb")) {
          const pairData = currencyPairsData.find(
            (item) => item.id === data[0]
          );

          if (!pairData) {
            return null;
          }

          const newData = {
            mid: (data[9] + data[10]) / 2,
            bid: data[1],
            ask: data[3],
            last_price: data[7],
            low: data[10],
            high: data[9],
            volume: data[8],
            timestamp: `${new Date().getTime()}`,
            symbol: pairData.symbol,
          };

          setDataCurrencies((prev) =>
            prev.map((item) => {
              if (item.symbol === pairData.symbol) {
                return newData;
              }
              return item;
            })
          );
        }
      } else if (typeof data === "object") {
        if (data.event === "subscribed") {
          setCurrencyPairsData((prev) => [
            ...prev,
            { symbol: data.pair.toUpperCase(), id: data.chanId },
          ]);
        }
      }
    };
  }, [currencyPairsData]);

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
