import React, { useContext } from "react";
import { TableOfCurrencies } from "../components/Tables/TableOfCurrencies";
import { ApplicationContext } from "../context/ApplicationContext";

export default function HomePage() {
  const { dataCurrencies } = useContext(ApplicationContext);

  return <TableOfCurrencies data={dataCurrencies}></TableOfCurrencies>;
}
