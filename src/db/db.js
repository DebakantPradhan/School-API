import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: join(__dirname, '../../.env') });
}

// For production, check if we have a DATABASE_URL (from Render)
let pool;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  console.log('Connecting to database using DATABASE_URL in production');
  // Parse the connection string
  const connectionString = process.env.DATABASE_URL;
  
  // Create connection pool using the URL
  pool = mysql.createPool(connectionString);
} else {
  console.log('Connecting to database using individual parameters');
  // Create connection pool using individual parameters
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });
}

// Test the connection
try {
  const connection = await pool.getConnection();
  console.log('✅ Database connected successfully');
  connection.release();
} catch (error) {
  console.error('❌ Database connection error:', error.message);
  console.error('Connection details:', {
    nodeEnv: process.env.NODE_ENV,
    usingUrl: Boolean(process.env.NODE_ENV === 'production' && process.env.DATABASE_URL),
    host: process.env.NODE_ENV !== 'production' ? process.env.DB_HOST : '(using connection string)',
    database: process.env.NODE_ENV !== 'production' ? process.env.DB_NAME : '(using connection string)'
  });
}

export default pool;