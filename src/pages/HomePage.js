// import axios from "axios";
import React, { useContext } from "react";
import { TableOfCurrencies } from "../components/Tables/TableOfCurrencies";
import { ApplicationContext } from "../context/ApplicationContext";

// const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
// const API_URL = "https://api.bitfinex.com/v1/symbols";

export default function HomePage() {
  const { dataCurrencies } = useContext(ApplicationContext);

  return <TableOfCurrencies data={dataCurrencies}></TableOfCurrencies>;
}
