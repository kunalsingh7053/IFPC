const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
const userRoutes = require('./routes/member.routes');
const chatRoutes = require('./routes/chat.routes');
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});





app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat', chatRoutes);





module.exports = app; 