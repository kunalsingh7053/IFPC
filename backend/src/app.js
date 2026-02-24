const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
app.use(express.json());
app.use(cookieParser());





app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes);




module.exports = app;