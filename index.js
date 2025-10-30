const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to js-dex - Express + Redis Application',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const redisConnected = redisClient.isOpen;
    res.json({ 
      status: 'ok',
      redis: redisConnected ? 'connected' : 'disconnected'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
});

// Set a value in Redis
app.post('/set', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ 
        error: 'Both key and value are required' 
      });
    }
    
    await redisClient.set(key, value);
    res.json({ 
      message: 'Value set successfully',
      key,
      value 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to set value',
      message: err.message 
    });
  }
});

// Get a value from Redis
app.get('/get/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await redisClient.get(key);
    
    if (value === null) {
      return res.status(404).json({ 
        error: 'Key not found' 
      });
    }
    
    res.json({ 
      key,
      value 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to get value',
      message: err.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});
