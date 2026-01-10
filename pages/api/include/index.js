import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('habittracker');
  const collection = db.collection('includedGames');

  // --- GET: Fetch all games ---
  if (req.method === 'GET') {
    try {
      const doc = await collection.findOne({});
      return res.status(200).json(doc ? doc.games : []);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch' });
    }
  }

  // --- POST: Add a new game ---
  if (req.method === 'POST') {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required' });
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const time = now
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase()
      .replace(' ', '');

    const newAchievement = {
      gameId: gameId,
      unlockedAt: `${day} ${month} @ ${time}`,
      unlocktime: new Date(),
    };

    try {
      // Avoid duplicates
      const existing = await collection.findOne({ 'games.gameId': gameId });

      if (!existing) {
        await collection.updateOne(
          {},
          { $push: { games: newAchievement } },
          { upsert: true }
        );
      }

      const finalDoc = await collection.findOne({});
      return res.status(201).json(finalDoc ? finalDoc.games : []);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update' });
    }
  }

  // --- DELETE: Remove a game ---
  if (req.method === 'DELETE') {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required to delete' });
    }

    try {
      // Use $pull to remove the item from the array where gameId matches
      await collection.updateOne({}, { $pull: { games: { gameId: gameId } } });

      const finalDoc = await collection.findOne({});
      return res.status(200).json(finalDoc ? finalDoc.games : []);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  // Fallback for unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
