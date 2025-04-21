import pool from '../db/db.js';

export const listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const [schools] = await pool.execute(
            `SELECT *, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude)))) AS distance 
            FROM schools 
            ORDER BY distance`,
            [latitude, longitude, latitude]
        );

        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};