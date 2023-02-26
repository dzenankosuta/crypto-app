import axios from "axios";
import React, { useEffect } from "react";
const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
// const httpsProxyAgent = require("https-proxy-agent");

const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const API_URL = "https://api.bitfinex.com/v1/symbols";

export default function HomePage() {
  //   const proxyUrl = "http://localhost:3000";
  //   const proxyAgent = new httpsProxyAgent(proxyUrl);

  //   const axiosInstance = axios.create({
  //     baseURL: "https://api.bitfinex.com/v1",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     httpsAgent: proxyAgent,
  //   });
  useEffect(() => {
    wss.onmessage = (msg) => console.log(msg.data);
    wss.onopen = () => {
      console.log("is open");
      // API keys setup here (See "Authenticated Channels")
    };
  }, []);

  useEffect(() => {
    // axiosInstance
    //   .get("/symbols")
    //   .then((res) => {
    //     const currencies = res.slice(0, 5).map((c) => ({
    //       event: "subscribe",
    //       channel: c,
    //     }));
    //     currencies.forEach((item) => {
    //       wss.send(JSON.stringify(item));
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    axios.get(CORS_PROXY_URL + API_URL).then((res) => {
      const currencies = res.slice(0, 5).map((c) => ({
        event: "subscribe",
        channel: c,
      }));
      currencies.forEach((item) => {
        wss.send(JSON.stringify(item));
      });
    });
  }, []);

  return <div>HomePage</div>;
}
