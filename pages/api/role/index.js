export default function handler(req, res) {
  if (req.method === "GET") {
    const { user } = req.query;
    let department = "";
    if (user == "saravana") {
      department = "IT";
    }
    if (user == "jeeva") {
      department = "ECE";
    }
    res.status(200).json({ message: "API Success", department });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
