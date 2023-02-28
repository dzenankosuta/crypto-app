import React, { useContext } from "react";
import { TableOfCurrencies } from "../components/Tables/TableOfCurrencies";
import { ApplicationContext } from "../context/ApplicationContext";

export default function Favorites() {
  const { dataCurrencies, favorites } = useContext(ApplicationContext);
  let favoriteCurrencies = [];
  if (favorites) {
    favoriteCurrencies = dataCurrencies.filter((curr) =>
      favorites.includes(curr?.symbol)
    );
  }
  return (
    <>
      {favoriteCurrencies.length ? (
        <TableOfCurrencies data={favoriteCurrencies}></TableOfCurrencies>
      ) : (
        <h2 style={{ margin: "50px auto 10px", width: "85%" }}>
          You don't have any favorite currencies yet.
        </h2>
      )}
    </>
  );
}
