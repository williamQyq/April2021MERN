import express from 'express';
import bbItemsRouter from '#routes/api/bb_items.js';
import msItemsRouter from '#routes/api/ms_items.js';
// import wmItemsRouter from '#routes/api/wm_items.js';
import itemsRouter from '#routes/api/items.js';
import usersRouter from '#routes/api/users.js';
import authRouter from '#routesV1/api/auth.js';
import wmsRouter from '#routes/api/wms.js';
import wmsV1Router from "#routesV1/api/wmsV1.js";
import operationRouter from '#routes/api/operation.js';
import operationV1Router from '#routesV1/api/operationV1.js';

import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import passportSetup from '#rootTS/lib/middleware/passport.js';
import session from 'express-session';

passportSetup(passport);
//@Bodyparser Middleware
const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;

// @server connection
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

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


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("Now we can set global variable");
        res.locals.user = req.user;
        console.log(req.user)
        next();
    } else {
        console.log("Now we can not set global variable");
        res.locals.user = null;
        next();
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

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
