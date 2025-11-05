import express from "express";
import bcrypt from "bcrypt";
import supabase from "../supabaseClient.js";  
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          address,
          role,
        },
      ])
      .select("id, name, email, address, role")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(400).json({ error: "User not created" });
    }

    const token = jwt.sign(
      { id: data.id, role: data.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );

    res.json({ ...data, token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },   
      process.env.JWT_SECRET || "supersecret", 
      { expiresIn: "1h" } 
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/update-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("password") 
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid old password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ password: hashedNewPassword })
      .eq("id", userId);

    if (updateError) throw updateError;

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, address, role"); 

    if (error) throw error;

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
