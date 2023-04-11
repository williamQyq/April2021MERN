`use strict`
import express from 'express';

import path from 'path';
//for ts path alias resolve...

import bbItemsRouter from '#routes/api/bb_items.js';
import msItemsRouter from '#routes/api/ms_items.js';
// import wmItemsRouter from '#routes/api/wm_items.js';
import itemsRouter from '#routes/api/items.js';
import usersRouter from '#routes/api/users.js';
import wmsRouter from '#routes/api/wms.js';
import operationRouter from '#routes/api/operation.js';
import wmsV1Router from "#routes/api/wmsV1";
import authRouter from '#routes/api/auth';
import operationV1Router from '#routes/api/operationV1';

import dotenv from 'dotenv'
import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import passportSetup from '#root/lib/middleware/passport';
import session from 'express-session';

import * as myAtlasDb from "#root/lib/db/mongoDB";

dotenv.config();
passportSetup(passport);

//@Bodyparser Middleware
const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;

// @server connection
const server = app.listen(port, () => {
    let env = undefined;
    if (process.env.NODE_ENV === "production") {
        env = "*** Production ***"
    }
    else {
        env = "*** Development ***"
    }
    console.log(`${env}\n\nServer started on port ${port}...`);
});

myAtlasDb.connect();

//development session config
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}))


app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

//@routes; direct axios request from client
app.use('/api/bestbuy', bbItemsRouter);
app.use('/api/microsoft', msItemsRouter);
// app.use('/api/walmart', wmItemsRouter);
// app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
// app.use('/api/keepa', require('./routes/api/keepa'));
app.use('/api/wms', wmsRouter);
app.use('/api/wmsV1', wmsV1Router);
app.use('/api/operation', operationRouter);
app.use('/api/operationV1', operationV1Router);


// @Socket IO listner
const io = new Server(server, {
    pingTimeout: 21000,
    pingInterval: 20000,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"]
});


io.engine.on("connection_error", (err) => {
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected!!! \n `)
    socket.on(`subscribe`, (room) => {
        try {
            socket.join(room);
            console.log(`A user Connected: ${socket.id}. Joined Room: ${room}`)
        } catch (e) {
            console.error(`[Socket Error] join room error`, e)
        }
    })

    socket.on(`unsubscribe`, (room) => {
        try {
            // const rooms = io.sockets.adapter.sids[socket.id]
            socket.leave(room)
            console.log(`A user ${socket.id} leaved room: ${room}`)
        } catch (e) {
            console.error(`[Socket Error] leave room error`, e)
        }
    })

    socket.on(`disconnect`, (reason) => {
        console.log(`\nUSER DISCONNECTED: ${socket.id}\n***REASON:${reason}***\n`);
    })
    socket.on('error', (reason) => {
        console.error(`[Socket Error] ${reason}`)
    })
})


export default io;
