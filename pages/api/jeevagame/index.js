import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, url, value } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: 'Name, is required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      await db.collection('allgames').insertOne({
        name,
        url, value
      });

      res.status(201).json({ message: 'Achievement added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add spends' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const jeevagame = await db
        .collection('allgames')
        .find({})
        .toArray();
      res.status(200).json(jeevagame);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Jeeva Achievements' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
