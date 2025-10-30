# js-dex

A basic JavaScript project using Express and Redis.

## Features

- Express.js web server
- Redis integration for data storage
- RESTful API endpoints for key-value operations
- Health check endpoint
- Graceful shutdown handling

## Prerequisites

- Node.js (v14 or higher)
- Redis server (optional for testing without Redis)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/simonAchieve/js-dex.git
cd js-dex
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
```bash
export PORT=3000
export REDIS_URL=redis://localhost:6379
```

## Running the Application

Start the server:
```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### GET /
Returns a welcome message and application status.

**Response:**
```json
{
  "message": "Welcome to js-dex - Express + Redis Application",
  "status": "running"
}
```

### GET /health
Returns the health status of the application and Redis connection.

**Response:**
```json
{
  "status": "ok",
  "redis": "connected"
}
```

### POST /set
Sets a key-value pair in Redis.

**Request Body:**
```json
{
  "key": "mykey",
  "value": "myvalue"
}
```

**Response:**
```json
{
  "message": "Value set successfully",
  "key": "mykey",
  "value": "myvalue"
}
```

### GET /get/:key
Retrieves a value from Redis by key.

**Response:**
```json
{
  "key": "mykey",
  "value": "myvalue"
}
```

## Running Without Redis

If Redis is not available, the application will still start but Redis-dependent endpoints will return errors. The health endpoint will indicate Redis is disconnected.

## License

MIT