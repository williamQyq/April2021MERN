import express from 'express';
import bbItemsRouter from '#routes/api/bb_items.js';
import msItemsRouter from '#routes/api/ms_items.js';
import wmItemsRouter from '#routes/api/wm_items.js';
import itemsRouter from '#routes/api/items.js';
import usersRouter from '#routes/api/users.js';
import authRouter from '#routes/api/auth.js';
import wmsRouter from '#routes/api/wms.js';
import operationRouter from '#routes/api/operation.js';
import { Server } from 'socket.io';

//@Bodyparser Middleware
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

// @server connection
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//@routes; direct axios request from client
app.use('/api/bb_items', bbItemsRouter);
app.use('/api/ms_items', msItemsRouter);
app.use('/api/wm_items', wmItemsRouter);
// app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
// app.use('/api/keepa', require('./routes/api/keepa'));
app.use('/api/wms', wmsRouter);
app.use('/api/operation', operationRouter);
// app.use('/api/inbound', require('./routes/api/inbound'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

// @Socket IO listner
const io = new Server(server, { 'pingTimeout': 7000, 'pingInterval': 3000 });
io.on("connection", (socket) => {
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

    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED: ${socket.id}`);
    })
})


export default io;
