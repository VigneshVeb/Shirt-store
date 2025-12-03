import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to ShirtStore</h1>
      <p>
        <Link to="/products">Browse products</Link>
      </p>
    </div>
  );
}
