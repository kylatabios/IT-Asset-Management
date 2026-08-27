const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        console.log("Connecting to SQL Server...");
        console.log("Server:", dbConfig.server);
        console.log("Port:", dbConfig.port);
        console.log("Database:", dbConfig.database);
        console.log("User:", dbConfig.user);

        const pool = await sql.connect(dbConfig);

        console.log("Database connected successfully");

        return pool;
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
        throw error;
    }
};

module.exports = {
    sql,
    dbConfig,
    connectDB
};