import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import resourceRoutes from './routes/resourceRoutes';
import transactionRoutes from './routes/transactionRoutes';
import scrapRoutes from './routes/scrapRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/scrap', scrapRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'ECONEXUS API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(config.port, () => {
        console.log(`🚀 ECONEXUS Server running on port ${config.port}`);
        console.log(`📡 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Client URL: ${config.clientUrl}`);
    });
};

startServer().catch(console.error);

export default app;
