import pool from '../db/db.js';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
};

export const listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        
        // Validate parameters
        if (!latitude || !longitude) {
            return res.status(400).json({ 
                success: false, 
                error: 'Latitude and longitude parameters are required' 
            });
        }
        
        // Convert to numbers
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
        
        // Validate coordinates
        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ 
                success: false,
                error: 'Latitude and longitude must be valid numbers' 
            });
        }
        
        // Fetch all schools
        const [schools] = await pool.execute('SELECT * FROM schools');
        
        // Add distance to each school
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(
                userLat,
                userLon,
                school.latitude,
                school.longitude
            );
            
            return {
                ...school,
                distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
            };
        });
        
        // Sort by distance
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        
        return res.status(200).json({
            success: true,
            schools: schoolsWithDistance
        });
    } catch (error) {
        console.error('Error listing schools:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Database error',
            details: error.message 
        });
    }
};