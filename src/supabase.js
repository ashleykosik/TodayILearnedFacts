import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xiyjasdypawekjajxzsg.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeWphc2R5cGF3ZWtqYWp4enNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY0MzYwMjQsImV4cCI6MjAwMjAxMjAyNH0.Mzr1LTtW908-syn4UN4KaqKmRa1mnROAqnHotth9PwM";
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;