/* Modules */
const express = require('express');
const app = express();
const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const db = require('./config/mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user')

const authRoutes = require('./routes/authRoutes');

const PORT = 8000;

// For Socket
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const { SocketAddress } = require('net');
const io = socketio(server);



/* Setting up view engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname , 'assets')));

app.use(express.urlencoded({extended:true}));

sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true
}

// MiddleWares

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    // iske baad success wala variable har ek template ke uper applicable hoo jega
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currectUser = req.user;
    next();
});



/* Initializing passport.js */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(authRoutes);


const users={}    // User Object



io.on('connection', (socket) => {
    
    socket.on('send_msg', (data) => {

        io.emit('recieved_msg', {
            msg: data.msg,
            user: data.user
        })

    });

    socket.on('login', (data) => {
        users[socket.id] = data.user;   
    });

});


/* Firing up the server */
server.listen(PORT, (err) => {
    if(err) {
        console.log("Error in Starting the server")
    }
    console.log(`Server running at port ${PORT}`);
})