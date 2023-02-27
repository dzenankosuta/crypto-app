// import axios from "axios";
import React, { useEffect, useState } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
// const httpsProxyAgent = require("https-proxy-agent");
const crypto = require("crypto-js");

// const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
// const API_URL = "https://api.bitfinex.com/v1/symbols";

export default function HomePage() {
  const [currencies, setCurrencies] = useState([]);
  const [dataCurrencies, setDataCurrencies] = useState([]);
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
          setDataCurrencies((prev) => [...prev, data]);
          // console.log(data);
        });
    });
  }, [currencies.length]);

  console.log(currencies);
  console.log(dataCurrencies);

  return <div>HomePage</div>;
}
