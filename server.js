const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass123",
    database: "shoppingonline"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {
    var sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100))";
    var result = await queryDB(sql);
    sql = `INSERT INTO userInfo (reg_date, username, email, password) VALUES (now(), "${req.body.username}", "${req.body.email}", "${req.body.pass}")`;
    result = await queryDB(sql);
    console.log("New record created successfullyone");
    return res.redirect('/login/login.html');
    
})

app.post('/checkLogin',async (req,res) => {

    var input =  await req.body;
    var sql = `SELECT id, username, email, password FROM userInfo`;
    var result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);

    for(var i =0; i< keys.length ;i++)
    {   
        if(input.username == result[keys[i]].username &&  input.password == result[keys[i]].password){
            res.cookie('username',input.username);
            console.log("Login success");
            return res.redirect('/product.html');
        }
        console.log(input.password);
        console.log(result[keys[i]].password);
    }
    return res.redirect('/login/login.html?error=1');
})

app.get("/showDB", async (req,res) => {
    var sql = `SELECT Product_id, Product_name, Product_price,Product_img  FROM ProductList`;
    var result = await queryDB(sql);
    result = Object.assign({},result);
    // console.log(result);
    res.json(result);
})

app.post('/CheckStock',async (req,res) => {

    var input =  await req.body;
    var sql = `SELECT Product_id, Product_name, Product_price,Product_img  FROM ProductList`;
    var result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);

    for(var i =0; i< keys.length ;i++)
    {   
        if(input.Product_name == result[keys[i]].Product_name){
            res.cookie('PruductName',input.Product_name);
            res.cookie('Quannity',input.Product_Quannity);
            sql = "CREATE TABLE IF NOT EXISTS Cart (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, Product_name VARCHAR(255),ITEM_QUANNITY INT(10))";
            result = await queryDB(sql);
            sql = `INSERT INTO Cart (reg_date, Product_name, ITEM_QUANNITY) VALUES (now(), "${req.body.Product_name}", "${req.body.Product_Quannity}")`;
            result = await queryDB(sql);
            console.log("Add cart success");
            return res.redirect('/product.html');
        }
    }
    return res.redirect('/product.html?error=1');
})

app.post("/UpdateQuannity",async (req,res) => {
    let sql = `UPDATE Cart SET ITEM_QUANNITY = '${req.body.Product_Quannity}' WHERE Product_name = '${req.body.Product_name}'`;
    let result = await queryDB(sql);
    // console.log(result);
    console.log("Record updated successfully");
    return res.redirect('/product.html');
})

app.get("/showCarts", async (req,res) => {
    var sql =
    `SELECT * FROM ProductList JOIN Cart ON ProductList.Product_name = Cart.Product_name`;
    var result = await queryDB(sql);
    result = Object.assign({},result);
    console.log(result);
    res.json(result);
})

app.get('/logout',async (req,res) => {
    var sql = `DELETE FROM Cart`;
    var result = await queryDB(sql);
    res.clearCookie('username');
    console.log("Cart Deleted");
    res.redirect('/login/register.html');
})

app.get('/Purchased',async (req,res) => {
    var sql = "CREATE TABLE IF NOT EXISTS OrderCustomer (id INT AUTO_INCREMENT PRIMARY KEY,reg_date TIMESTAMP , Product_name VARCHAR(255),ITEM_QUANNITY INT(10))";
    var result = await queryDB(sql);
    sql = `INSERT INTO OrderCustomer (reg_date, Product_name, ITEM_QUANNITY) SELECT reg_date, Product_name, ITEM_QUANNITY FROM Cart`;
    result = await queryDB(sql);
    result = Object.assign({},result);
    sql = `DELETE FROM Cart`;
    result = await queryDB(sql);
    res.redirect('/Purchased.html');
})

app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});
