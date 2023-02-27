import React, { useContext } from "react";
import { Table } from "@mantine/core";
import { useLocation } from "react-router-dom";
import "./TableDetails.css";
import { LoginContext } from "../../context/LoginContext";

export default function TableDetails() {
  const { token, dataCurrencies, addToFavorites, removeFromFavorites } =
    useContext(LoginContext);
  const location = useLocation();
  const { name } = location.state;
  const currency = dataCurrencies.find((curr) => curr.symbol === name);
  const btnVisibility = !token ? "none" : "flex";
  const btnBack = currency.favorite ? "remove-btn" : "add-btn";
  const changeFav = currency.favorite ? removeFromFavorites : addToFavorites;

  return (
    <div>
      <Table
        fontSize="md"
        striped
        withBorder
        withColumnBorders
        style={{ margin: "50px auto 10px", width: "80%" }}
      >
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{currency.symbol}</td>
            <td>{currency.last_price}</td>
            <td>{currency.high}</td>
            <td>{currency.low}</td>
          </tr>
        </tbody>
      </Table>
      <div className="section" style={{ display: btnVisibility }}>
        <button
          className={`fav-btn ${btnBack}`}
          onClick={() => changeFav(currency.symbol)}
        >
          {currency.favorite ? (
            <span>Remove from Favorites</span>
          ) : (
            <span>Add to favorites</span>
          )}
        </button>
      </div>
    </div>
  );
}
