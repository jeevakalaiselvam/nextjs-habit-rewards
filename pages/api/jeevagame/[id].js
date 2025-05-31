import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { url } = req.body;

    let finalUrl = url?.includes('/revision/latest')
      ? url?.split('/revision/latest')?.[0]
      : url;

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db.collection('allgames').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            url: finalUrl,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      res.status(200).json({ message: 'Achievement updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update Achievement' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection('allgames')
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Achievement deleted successfully' });
      } else {
        res.status(404).json({ error: 'Achievement not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete Achievement' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
