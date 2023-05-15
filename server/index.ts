import express from 'express';
import BestbuyRouter from 'lib/routes/api/bestbuy.api';
import msItemsRouter from '#routes/api/ms_items.js';
// import wmItemsRouter from '#routes/api/wm_items.js';
import itemsRouter from '#routes/api/items.js';
import usersRouter from '#routes/api/users.js';
import wmsRouter from 'lib/routes/api/wmsV0.api';
import operationRouter from '#routes/api/operation.js';
import wmsV1Router from "#routes/api/wmsV1";
import authRouter from '#routes/api/auth';
import operationV1Router from '#routes/api/operationV1';

import config from 'config';
import dotenv from 'dotenv'
import * as SocketIO from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import passportSetup from '#root/lib/middleware/passport';
import * as myAtlasDb from "#root/lib/db/mongoDB";

import http from 'http';
import path from 'path';

dotenv.config();
passportSetup(passport);

const app = express();

//Cross-Origin Resource Sharing (CORS)
const ORIGIN: string = process.env.NODE_ENV === "production" ?
    config.get<string>("origin.prod")
    : config.get<string>("origin.dev");

app.use(cors({ origin: ORIGIN }));

//parse incoming JSON data and converts it to JS object which is then attached to req.body.
app.use(express.json())

// @server connection
const port: number = process.env.PORT || 5000;
const server: http.Server = app.listen(port, () => {
    let env = process.env.NODE_ENV === "production" ?
        "Production"
        : "Development";
    console.log(`***[${env}]***\n\nServer started on port ${port}...`);
});

myAtlasDb.connect();

//development session config
app.use(session(
    {
        secret: process.env.SESSION_KEY as string,
        resave: false,
        // connect.session() MemoryStore is not designed for a production environment, 
        // as it will leak memory, and will not scale past a single process.
        // ***solve add below*** : 
        // store: new RedisStore(), 
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    } as session.SessionOptions
))

//passport OAuth middleware.
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    const __dirname: string = path.dirname(new URL(import.meta.url).pathname);
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
    app.get('*', (_, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

//@routes; direct axios request from client
app.use('/api/bestbuy', BestbuyRouter);
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
const io = new SocketIO.Server(server, {
    pingTimeout: 21000,
    pingInterval: 20000,
    cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"]
});

// io.engine.on("connection_error", (err) => {
//     console.log(err.code);     // the error code, for example 1
//     console.log(err.message);  // the error message, for example "Session ID unknown"
//     console.log(err.context);  // some additional error context
// });

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
