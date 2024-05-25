import mysql from 'mysql2';

export const conn = new mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password:'atulya',
    database:'school'
});


if(conn){
    console.log("database is connected");
}else{
    console.log('database is not connected');
}
