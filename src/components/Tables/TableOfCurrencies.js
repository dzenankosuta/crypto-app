import React from "react";
import { Table } from "@mantine/core";
import { Link } from "react-router-dom";

export function TableOfCurrencies({ data }) {
  const rows = data.map((currency) => (
    <tr key={currency?.symbol}>
      <td>
        <Link
          to="details"
          style={{ color: "#008e5f", textDecoration: "none" }}
          state={{ name: currency?.symbol }}
        >
          {currency?.symbol}
        </Link>
      </td>
      <td>{currency?.last_price}</td>
      <td>{currency?.volume}</td>
      <td>{currency?.symbol}</td>
      <td>{currency?.high}</td>
      <td>{currency?.low}</td>
    </tr>
  ));

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
          <th>Name</th>
          <th>Last</th>
          <th>Change</th>
          <th>Change Percent</th>
          <th>High</th>
          <th>Low</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
