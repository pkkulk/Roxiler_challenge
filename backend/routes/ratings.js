import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { store_id, user_id, rating } = req.body;

    if (!store_id || !user_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("ratings")
      .select("id")
      .eq("store_id", store_id)
      .eq("user_id", user_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    let result;

    if (existing) {
      const { data, error } = await supabase
        .from("ratings")
        .update({ rating })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("ratings")
        .insert([{ store_id, user_id, rating }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json({ success: true, rating: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/user/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("id, rating, store_id, stores(name, address)")
      .eq("user_id", req.params.id);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
