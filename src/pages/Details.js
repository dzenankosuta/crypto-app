import React, { useContext } from "react";
import TableDetails from "../components/Tables/TableDetails";
import { ApplicationContext } from "../context/ApplicationContext";

export default function Details() {
  const { isLoading } = useContext(ApplicationContext);
  if (isLoading) {
    return <h3 style={{ margin: "100px auto" }}>Loading...</h3>;
  }
  return <TableDetails />;
}
