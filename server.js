// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const session = require('express-session');
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

app.use(session({
	secret: 'forceHttp',
	resave: true,
	saveUninitialized: true,
  cookie: { maxAge: 60000 }//1MIN SESSION
}));


// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, dream TEXT)"
    );
    console.log("New table Dreams created!");

    // insert default dreams
    db.serialize(() => {
      db.run(
        'INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
      );
    });
  } else {
    console.log('Database "Dreams" ready to go!');
    db.each("SELECT * from Dreams", (err, row) => {
      if (row) {
        console.log(`record: ${row.dream}`);
      }
    });
  }
});

app.get("/nbfcXyrtq",(request,response)=>{
  response.sendFile(`${__dirname}/views/adminlogin.html`);
});

app.post("/mirage",(request,response)=>{
  var q1 = "SELECT SNO FROM ADMINS WHERE USERNAME = ? AND PASSWORD = ?";
  var u = cleanseString(request.body.uname);
  u = u.toUpperCase();
  var p = cleanseString(request.body.pwd);
  p = p.toUpperCase();
  console.log(u, " ", p);
  db.get(q1,[u,p],(err,row)=>{
    if(!row)
      {
        response.send("invalid credentials");
        response.end();
      }
    else
      {
       request.session.admin = true;
       response.redirect("/jandk"); 
      }
  });
  
});




app.get("/jandk",(request,response)=>{
  if(request.session.admin == true)
    {
      response.sendFile(`${__dirname}/views/admin.html`);
    }
  else
    {
      response.send("Session Expired");
      response.end();
    }
});


app.post("/getin",(request,response)=>{
  var q1 = "SELECT SNO FROM USERDETAILS WHERE USERNAME = ? AND FATHER = ?";
  var u = cleanseString(request.body.names);
  var p = cleanseString(request.body.namef);
  u = u.toUpperCase();
  p = p.toUpperCase();
  console.log(u," ",p);
  db.get(q1,[u,p],(err,row)=>{
    if(!row)
      {
        response.send("invalid credentials");
        response.end();
      }
    else{
      console.log("LOGIN SUCCESS");
      request.session.loggedin = true;
      request.session.username = u;
      response.redirect("/users");
    }
  });
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/login.html`);
});

app.get("/signup",(request,response)=>{
  response.sendFile(`${__dirname}/views/signup.html`);
});

app.post("/signin",(request,response)=>{
  var f = request.body.first;
  f = f.toUpperCase();
  var l = request.body.last;
  l = l.toUpperCase();
  var father = request.body.father;
  father = father.toUpperCase()
  var email = request.body.email;
  email = email.toUpperCase();
  var uname = request.body.username;
  uname = uname.toUpperCase();
  var cls = request.body.class;
  cls = cls.toUpperCase();
  console.log(f,l,father,email,uname,cls);
  response.send('<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content="A cool thing made with Glitch"><title>Online Exam App</title><link id="favicon" rel="icon" href="https://glitch.com/edit/favicon-app.ico" type="image/x-icon">  </head> <body>Thanks for Signing up.<br/>You can login from here : <a href="/">Login</a> </body> </html>');
});

app.get("/logout/admin",(request,response)=>{
  if(request.session.admin){
  delete request.session.admin;
  response.redirect("/");
  }
  else
    {
      response.send("invalid request");
      response.end();
    }
});

app.get("/logout/user",(request,response)=>{
  if(request.session.loggedin && request.session.username){
  delete request.session.loggedin;
  delete request.session.username;
  response.redirect("/");
  }
  else
    {
      response.send("invalid request");
      response.end();
    }
});


app.get("/users",(request,response)=>{
  if(request.session.loggedin == true && request.session.username)
    {
      response.sendFile(`${__dirname}/views/userview.html`);
    }
});
// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

app.get("*",(request,response)=>{
  response.send("<!DOCTYPE html><html><head><meta charset='utf-8' /><meta http-equiv='X-UA-Compatible' content='IE=edge' /><meta name='viewport' content='width=device-width, initial-scale=1,user-scalable=no'/><meta name='description' content='POLL APP'/><title>TYCS voting error</title><body>Nah, you cant get past any routes</body></html>");
  response.end();
});





//  **************************************** TEST AREA BELOW **************************************************


/*db.all("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",(err,row)=>{
  if(err)
  console.log(err);
  else
  console.log(row);
});*/

//db.run("DROP TABLE USERDETAILS");
//db.run("CREATE TABLE USERDETAILS(SNO INTEGER PRIMARY KEY,FIRST TEXT, LAST TEXT,FATHER TEXT, EMAIL TEXT, USERNAME TEXT, CLASS INTEGER)");


//db.run("CREATE TABLE ADMINS(SNO INTEGER PRIMARY KEY,USERNAME TEXT NOT NULL, PASSWORD TEXT NOT NULL)");

//db.run("INSERT INTO ADMINS(USERNAME,PASSWORD) VALUES('SHIKHAR','SHIKHAR')");

//db.run("INSERT INTO USERDETAILS(FIRST,LAST,FATHER,EMAIL,USERNAME,CLASS) VALUES('SHIKHAR','ADITYA','NAVEEN CHANDRA ASTHANA','SATYAMSHIKHAR@GMAIL.COM','SATYAMPAPA',15)");

//db.get("SELECT * FROM USERDETAILS",(err,row)=>{
//if(err) console.log(err); else console.log(row);
//});