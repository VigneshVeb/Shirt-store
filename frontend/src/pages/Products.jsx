import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { Link } from "react-router-dom";

export default function Products(){
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.products);
  useEffect(()=> { dispatch(fetchProducts()); }, [dispatch]);
  if(loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Products</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
        {list.map(p => (
          <div key={p.id}>
            <Link to={`/product/${p.id}`}>
              <img src={p.image ? `http://localhost:8000${p.image}` : "/placeholder.png"} alt={p.name} width={200} />
              <h3>{p.name}</h3>
            </Link>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
