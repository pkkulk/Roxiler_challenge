import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service role key here
const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase.from("users").select("id").limit(1);

  if (error) {
    console.error("❌ Supabase connection failed:", error.message);
    process.exit(1);
  }

  console.log("✅ Supabase connected! Sample data:", data);
  process.exit(0);
} catch (err) {
  console.error("❌ Error connecting:", err.message);
  process.exit(1);
}
