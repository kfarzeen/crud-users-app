const {faker}=require ("@faker-js/faker");
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
require("dotenv").config();

const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

  let port=8080;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

function getRandomUser() {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
];

}
 
//let q="insert into user(id,username,email,password) values ?";

let data=[];
for(let i=0;i<100;i++){
  data.push(getRandomUser());
}

// try{
//     connection.query(q, [data], (err,result)=>{
//         if(err) throw err;
//         console.log(result);

//     });
// }
// catch(err){
//     console.log(err);
// }

app.listen(port,()=>{
    console.log("listening");
})
 

app.get("/",(req,res)=>{
    let q="select count(*) from user";
    try{
    connection.query(q,  (err,result)=>{
        if(err) throw err;
        let count=result[0]["count(*)"];
        res.render("home.ejs",{count});
    });
 }
catch(err){
    console.log(err);
 
    res.send(err);
}
    
});



app.get("/users",(req,res)=>{
    let q="select * from user";
    try{
    connection.query(q, (err,result)=>{
        if(err) throw err;
        let users=result;
       res.render("showusers.ejs",{users});
    });
 }
catch(err){
    console.log(err);
 
    res.send(err);
}
    
});



app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    
    try{
    connection.query(q,  (err,result)=>{
        if(err) throw err;
        let users=result[0];
       res.render("edituser.ejs",{users});
    });
 }
catch(err){
    console.log(err);
 
    res.send(err);
}
    
});


app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password:formpass,username:newusername}=req.body;
    let q=`select * from user where id='${id}'`;
    
    try{
    connection.query(q,  (err,result)=>{
        if(err) throw err;
        let users=result[0];

        if(formpass != users.password){
            res.send("incorrect password");
        }
        else{
       let q2=`update user set username='${newusername}' where id='${id}'`;
       
    connection.query(q2, (err,result)=>{
        if(err) throw err;
       res.redirect("/users");
}); }
    });
}
catch(err){
    console.log(err);
 
    res.send(err);

}
});
