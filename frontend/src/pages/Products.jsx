import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
      }}
    >
      {items.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", padding: 10 }}>
          <img
            src={p.image}
            alt={p.name}
            style={{ width: "100%", height: 250, objectFit: "cover" }}
          />

          <h3>{p.name}</h3>
          <p>Brand: {p.brand?.name}</p>
          <p>₹{p.price}</p>
          <p>{p.description}</p>

          {/* 👇 ADD TO CART BUTTON */}
          <button
            style={{
              marginTop: 10,
              padding: "8px 12px",
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() =>
              dispatch(
                addToCart({
                  product_id: p.id,
                  size: "S",
                  quantity: 1,
                })
              )
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
