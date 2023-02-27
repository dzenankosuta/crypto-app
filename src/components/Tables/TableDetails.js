import React from "react";
import { Table } from "@mantine/core";
import { useLocation } from "react-router-dom";

export default function TableDetails() {
  const location = useLocation();
  const { name, allCurrencies } = location.state;
  const currency = allCurrencies.find((curr) => curr.symbol === name);

  return (
    <Table
      fontSize="md"
      striped
      withBorder
      withColumnBorders
      style={{ margin: "50px auto 10px", width: "85%" }}
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
  );
}
