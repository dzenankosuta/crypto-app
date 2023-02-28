import React, { useContext } from "react";
import { TableOfCurrencies } from "../components/Tables/TableOfCurrencies";
import { ApplicationContext } from "../context/ApplicationContext";

export default function HomePage() {
  const { dataCurrencies, isLoading } = useContext(ApplicationContext);

  if (isLoading) {
    return <h3 style={{ margin: "100px auto" }}>Loading...</h3>;
  }

  return <TableOfCurrencies data={dataCurrencies}></TableOfCurrencies>;
}
