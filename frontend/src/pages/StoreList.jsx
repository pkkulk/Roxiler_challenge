import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function StoreList() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api.get("/stores")
      .then(res => setStores(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRating = async (storeId, rating) => {
    try {
      await api.post("/ratings", { store_id: storeId, user_id: user.id, rating });
      alert("Rating submitted!");
    } catch (err) {
      alert("Error submitting rating");
    }
  };

  return (
    <div>
      <h2>Stores</h2>
      {stores.map(s => (
        <div key={s.id}>
          <h3>{s.name} ({s.address})</h3>
          <p>Average Rating: {s.avg_rating}</p>
          <button onClick={() => handleRating(s.id, 5)}>⭐ 5</button>
          <button onClick={() => handleRating(s.id, 4)}>⭐ 4</button>
          <button onClick={() => handleRating(s.id, 3)}>⭐ 3</button>
          <button onClick={() => handleRating(s.id, 2)}>⭐ 2</button>
          <button onClick={() => handleRating(s.id, 1)}>⭐ 1</button>
        </div>
      ))}
    </div>
  );
}
