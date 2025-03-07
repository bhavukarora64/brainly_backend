import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'mysql-ce25c8b-hft-5b3f.j.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_h5MVQhGpDZQIvYYVww9',
    database: 'brainly',
    port: 10690,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool