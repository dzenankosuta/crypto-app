import React from "react";
import { Table } from "@mantine/core";
import { Link } from "react-router-dom";

export function TableOfCurrencies({ data }) {
  const rows = data.map((currency) => {
    const change = currency?.mid - currency?.last_price;
    const changePercent = (change / currency?.last_price) * 100;
    return (
      <tr key={currency?.symbol}>
        <td>
          <Link
            to={`/details/${currency?.symbol}`}
            style={{
              color: "#202A44",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            {currency?.symbol}
          </Link>
        </td>
        <td>{currency?.last_price.toLocaleString()}</td>
        <td>{change.toLocaleString()}</td>
        <td>{changePercent.toFixed(2)}%</td>
        <td>{currency?.high.toLocaleString()}</td>
        <td>{currency?.low.toLocaleString()}</td>
      </tr>
    );
  });

  return (
    <Table
      fontSize="md"
      striped
      withBorder
      withColumnBorders
      style={{ margin: "50px auto 10px", width: "86%" }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>Name</th>
          <th style={{ textAlign: "center" }}>Last</th>
          <th style={{ textAlign: "center" }}>Change</th>
          <th style={{ textAlign: "center" }}>Change Percent</th>
          <th style={{ textAlign: "center" }}>High</th>
          <th style={{ textAlign: "center" }}>Low</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
