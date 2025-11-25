import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  cta: String,
  image: String,
});

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
