// const express = require('express');
// //@Bodyparser Middleware
// const app = express();
// app.use(express.json());
// const port = process.env.PORT || 5000;
// // @server connection
// let server = app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });

// //@routes; direct axios request from client
// app.use('/api/bb_items', require('./routes/api/bb_items'));
// app.use('/api/ms_items', require('./routes/api/ms_items'));
// // app.use('/api/cc_items', require('./routes/api/cc_items'));
// app.use('/api/items', require('./routes/api/items'));
// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// // app.use('/api/keepa', require('./routes/api/keepa'));
// app.use('/api/wms', require('./routes/api/wms'));
// app.use('/api/operation', require('./routes/api/operation'));
// // app.use('/api/inbound', require('./routes/api/inbound'));

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
//     });
// }

// module.exports = {
//     app,
//     server
// }