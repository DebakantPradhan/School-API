# School API - Setup and Usage Guide

This README provides step-by-step instructions on how to set up and use the School Management API locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0 or later)
- [Git](https://git-scm.com/downloads) (optional, for cloning the repository)

## Installation

1. **Clone the repository or download the source code:**
   ```bash
   git clone https://github.com/DebakantPradhan/School-API.git
   cd School-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Database Setup

1. **Start MySQL Server:**

   **On Windows:**
   ```bash
   # Check if MySQL service is running
   net start mysql80

   # If not running, start it
   net start mysql80
   ```

   **On macOS:**
   ```bash
   brew services start mysql
   ```

   **On Linux (Ubuntu/Debian):**
   ```bash
   sudo service mysql start
   ```

2. **Log in to MySQL:**
   ```bash
   mysql -u root -p
   ```
   When prompted, enter your MySQL password (in this case: `Dhoni@1`).

3. **Create Database and Tables:**
   ```sql
   CREATE DATABASE IF NOT EXISTS school_management;
   USE school_management;
   
   CREATE TABLE IF NOT EXISTS schools (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     address VARCHAR(255) NOT NULL,
     latitude FLOAT NOT NULL,
     longitude FLOAT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   EXIT;
   ```

## Environment Configuration

1. **Ensure the `.env` file is configured correctly:**
   ```properties
   DB_HOST='localhost'
   DB_USER='root'
   DB_PASSWORD='Dhoni@1'
   DB_NAME='school_management'
   PORT=3000
   ```

   **Note:** Replace `Dhoni@1` with your actual MySQL password if different.

## Running the Application

1. **Start the API server:**
   ```bash
   npm run dev
   ```

2. **Verify the server is running:**
   You should see output similar to:
   ```
   Server running on port 3000
   Database connected successfully
   ```

## Testing the API

### Using Postman

1. **Add a School:**
   - Method: POST
   - URL: `http://localhost:3000/api/add-school`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "name": "Cambridge School",
       "address": "123 Education Street",
       "latitude": 12.9716,
       "longitude": 77.5946
     }
     ```

2. **List Schools:**
   - Method: GET
   - URL: `http://localhost:3000/api/list-schools?latitude=12.9716&longitude=77.5946`

## Postman Collection

You can test the API using the Postman collection. Click the button below to fork the collection into your Postman workspace:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/33660886-dd405c94-7fb8-49a7-8641-707b80062fe5?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D33660886-dd405c94-7fb8-49a7-8641-707b80062fe5%26entityType%3Dcollection%26workspaceId%3Db31a57ed-3d56-4604-baea-bd0ed9668053)

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify MySQL is running:
   ```bash
   # Windows
   net start mysql80
   
   # macOS
   brew services list
   
   # Linux
   sudo service mysql status
   ```

2. Check your MySQL credentials:
   ```bash
   mysql -u root -p -e "SELECT 'Connection successful!'"
   ```

3. Ensure the database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'school_management'"
   ```

### API Not Running

If the API fails to start:

1. Check if port 3000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```

2. Verify Node.js version:
   ```bash
   node -v
   ```

## Additional Information

- The API automatically connects to the MySQL database specified in the .env file
- Schools are stored with location information (latitude and longitude)
- The list endpoint sorts schools by proximity to the provided coordinates

For more information, please refer to the API documentation in the `/docs` directory.