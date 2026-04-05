require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { validateEnv } = require('./src/config/env');
const PORT = Number(process.env.PORT) || 3000;

let server;

async function startServer() {
    try {
        validateEnv();
        await connectDB();

        server = app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

function shutdown(signal) {
    console.log(`${signal} received. Shutting down server...`);
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();