import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, title, description, type } = req.body;

    if (!name || !title || !description || !type) {
      return res
        .status(400)
        .json({ error: 'Name, Title, Description, Type required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      await db.collection('jeevaachievements').insertOne({
        name,
        title,
        description,
        type,
        unlocked: new Date(),
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
      const jeevaAchievements = await db
        .collection('jeevaachievements')
        .find({})
        .toArray();
      res.status(200).json(jeevaAchievements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Jeeva Achievements' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
