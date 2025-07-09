export default async function handler(req, res) {
  const url = req.query.url;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MyBot/1.0)",
    },
  });

  if (!response.ok) {
    return res.status(500).send("Failed to fetch image", response?.status);
  }

  const contentType = response.headers.get("content-type");
  const buffer = await response.arrayBuffer();

  res.setHeader("Content-Type", contentType);
  res.send(Buffer.from(buffer));
}
