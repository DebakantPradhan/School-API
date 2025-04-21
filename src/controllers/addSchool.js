import pool from '../db/db.js';

export const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        
        // Validation
        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
        }

        // Check for duplicate school by name and address
        const [existingSchools] = await pool.execute(
            'SELECT * FROM schools WHERE (name = ? AND address = ?) OR (latitude = ? AND longitude = ?)',
            [name, address, latitude, longitude]
        );

        // If duplicate found
        if (existingSchools.length > 0) {
            let duplicateReason = '';
            const duplicate = existingSchools[0];
            
            if (duplicate.name === name && duplicate.address === address) {
                duplicateReason = 'A school with the same name and address already exists';
            } else {
                duplicateReason = 'A school at the exact same location already exists';
            }
            
            return res.status(409).json({
                error: 'Duplicate entry',
                message: duplicateReason,
                existingSchool: {
                    id: duplicate.id,
                    name: duplicate.name,
                    address: duplicate.address
                }
            });
        }

        // If no duplicate, insert new school
        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        res.status(201).json({
            success: true,
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ 
            success: false,
            error: 'Database error',
            details: error.message 
        });
    }
};

