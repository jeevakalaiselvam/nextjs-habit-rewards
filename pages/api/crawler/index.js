import axios from "axios";
import * as cheerio from "cheerio";

const TA_URL =
  "https://www.trueachievements.com/game/The-Elder-Scrolls-IV-Oblivion-Remastered/achievements";

export default async function handler(req, res) {
  try {
    const { data } = await axios.get(TA_URL);
    const $ = cheerio.load(data);

    const achievements = [];

    $(".achievement").each((i, el) => {
      const name = $(el).find(".achTitle").text().trim();
      const description = $(el).find(".achDesc").text().trim();
      const icon = $(el).find(".achImg img").attr("src");

      achievements.push({
        name,
        description,
        icon: icon?.startsWith("http")
          ? icon
          : `https://www.trueachievements.com${icon}`,
      });
    });

    res.status(200).json(achievements);
  } catch (error) {
    console.error("Scraping failed:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch achievements", error2: error });
  }
}
