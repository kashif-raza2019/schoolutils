const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Port Details
const port = process.env.PORT || 3000;

const mongoDB = require('./controller/db_connect');
const connection = mongoDB.connection;


// Session
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.SECRET,
    saveUninitialized: false
}));

// Routes
const homeRoute  = require('./routes/home');
const evaluationsRoute = require('./routes/evaluations');

// Middlewares
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(homeRoute);
app.use(evaluationsRoute);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    connection.once('open', ()=>{
        console.log('Connected to MongoDB');
    });
});


