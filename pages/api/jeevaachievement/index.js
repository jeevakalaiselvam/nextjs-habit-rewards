import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, title, description, type, value, priority, total,completed } = req.body;

    if (!name || !title || !description || !type || !value || !priority) {
      return res
        .status(400)
        .json({ error: 'Name, Title, Description, Type required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      await db.collection(value).insertOne({
        name,
        title,
        description,
        type,priority,
        total: total ?? 1,completed: completed ?? 0,
        unlocked: new Date(), achieved: false
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

      let allAchievements = []

      const jeevagames = await db
        .collection('allgames')
        .find({})
        .toArray();

      await Promise.all(
        jeevagames?.map(async (game) => {
          const gameAchs = await db
            .collection(game?.value)
            .find({})
            .toArray();

          allAchievements.push(...gameAchs);
        })
      );

      res.status(200).json(allAchievements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Jeeva Achievements' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
