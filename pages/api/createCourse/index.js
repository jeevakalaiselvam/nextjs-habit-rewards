export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, exclude, count } = req.body;
    if (!name || !exclude || !count) {
      res.status(404).json({ status: "Error" });
    }

    res.status(200).json({ message: "Create Success" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
