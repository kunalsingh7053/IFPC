const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const equipmentIssueRoutes = require('./routes/equipmentIssue.routes');
const userRoutes = require('./routes/member.routes');
const chatRoutes = require('./routes/chat.routes');
const fundsRoutes = require('./routes/funds.routes');
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,https://ifpc.netlify.app')
	.split(',')
	.map((origin) => origin.trim())
	.map((origin) => origin.replace(/\/$/, ''))
	.filter(Boolean);

app.use(cors({
	origin(origin, callback) {
		const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
		if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
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
app.use('/api/equipment', equipmentRoutes);
app.use('/api/equipment-issues', equipmentIssueRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/funds', fundsRoutes);

app.use((req, res) => {
	res.status(404).json({
		message: 'Route not found',
	});
});

app.use((err, _req, res, _next) => {
	if (err.message === 'Not allowed by CORS') {
		return res.status(403).json({ message: err.message });
	}

	if (!isProduction) {
		console.error(err);
	}

	return res.status(err.status || 500).json({
		message: isProduction ? 'Internal server error' : err.message,
	});
});





module.exports = app; 