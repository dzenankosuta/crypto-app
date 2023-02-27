import React, { useContext } from "react";
import { TableOfCurrencies } from "../components/Tables/TableOfCurrencies";
import { LoginContext } from "../context/LoginContext";

export default function Favorites() {
  const { dataCurrencies } = useContext(LoginContext);
  const favoriteCurrencies = dataCurrencies.filter(
    (curr) => curr?.favorite === true
  );

  return (
    <div>
      {favoriteCurrencies.length ? (
        <TableOfCurrencies data={favoriteCurrencies}></TableOfCurrencies>
      ) : (
        <h2 style={{ margin: "50px auto 10px", width: "85%" }}>
          You don't have any favorite currencies yet.
        </h2>
      )}
    </div>
  );
}
