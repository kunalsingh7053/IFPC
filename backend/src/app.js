const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
const userRoutes = require('./routes/member.routes');
const chatRoutes = require('./routes/chat.routes');
app.use(express.json());
app.use(cookieParser());





app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat', chatRoutes);





module.exports = app; 