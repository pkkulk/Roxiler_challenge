import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase.from("stores").select("id, name, address, owner_id");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: stores, error } = await query;
    if (error) throw error;

    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("store_id, rating");
    if (ratingsError) throw ratingsError;
    const avgRatings = {};
    ratings.forEach(r => {
      if (!avgRatings[r.store_id]) avgRatings[r.store_id] = [];
      avgRatings[r.store_id].push(r.rating);
    });

    const storesWithAvg = stores.map(store => {
      const ratingsArr = avgRatings[store.id] || [];
      const avg = ratingsArr.length
        ? (ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length).toFixed(1)
        : null;
      return { ...store, avg_rating: avg };
    });

    res.json(storesWithAvg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/add", async (req, res) => {
  try {
    const { name, address, email, user_id } = req.body;

    if (!name || !email || !address || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .insert([{ name, address, email, owner_id: user_id }])
      .select()
      .single();

    if (storeError) throw storeError;

    const { error: roleError } = await supabase
      .from("users")
      .update({ role: "owner" })
      .eq("id", user_id);

    if (roleError) throw roleError;

    res.json({
      success: true,
      store,
      message: "Store added successfully & role updated to owner",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/owner/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: stores, error: storeError } = await supabase
      .from("stores")
      .select("id, name, address, owner_id")
      .eq("owner_id", id)
      .single();

    if (storeError) throw storeError;
    if (!stores) return res.status(404).json({ error: "Store not found for this owner." });

    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("id, rating, created_at, users (id, name)")
      .eq("store_id", stores.id)
      .order("created_at", { ascending: false });

    if (ratingsError) throw ratingsError;

    const avgRating = ratings.length
      ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
      : null;

    res.json({
      store: { ...stores, avg_rating: avgRating },
      ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/all", async (req, res) => {
  try {
    const { data: stores, error } = await supabase
      .from("stores")
      .select("id, name, email, address"); 
    if (error) throw error;

    const { data: ratings, error: ratingsError } = await supabase
      .from("ratings")
      .select("store_id, rating");
    if (ratingsError) throw ratingsError;

    const avgRatings = {};
    ratings.forEach(r => {
      if (!avgRatings[r.store_id]) avgRatings[r.store_id] = [];
      avgRatings[r.store_id].push(r.rating);
    });

    const storesWithAvg = stores.map(store => {
      const ratingsArr = avgRatings[store.id] || [];
      const avg = ratingsArr.length
        ? (ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length).toFixed(1)
        : null;
      return { ...store, avg_rating: avg };
    });

    res.json(storesWithAvg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;