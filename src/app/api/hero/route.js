import { getHeroContent, updateHeroContent } from "../../server/controllers/heroController";

export async function GET() {
  const hero = await getHeroContent();
  return Response.json(hero);
}

export async function PUT(req) {
  const data = await req.json();
  const updatedHero = await updateHeroContent(data);
  return Response.json(updatedHero);
}
