import Hero from "../models/Hero";
import { connectDB } from "../../server/db/connect";

// GET Hero content
export async function getHeroContent() {
  await connectDB();
  const hero = await Hero.findOne();
  return hero;
}

// UPDATE Hero content
export async function updateHeroContent(data) {
  await connectDB();
  const updatedHero = await Hero.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
  });
  return updatedHero;
}
