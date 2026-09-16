# Node.js + Express + MongoDB Atlas Setup Guide

This guide walks you through setting up MongoDB Atlas with a Node.js + Express backend using Mongoose.

## 1. Create a MongoDB Atlas cluster

1. Go to https://cloud.mongodb.com/
2. Sign in or create an account.
3. Click Create a Deployment.
4. Choose the free Shared plan.
5. Select a cloud provider and region.
6. Click Create.
7. Wait for the cluster to finish provisioning.

## 2. Create a database user

1. In Atlas, open Database Access.
2. Click Add New Database User.
3. Choose Password authentication.
4. Create a username and strong password.
5. Grant the user read/write access to the database.
6. Save the user.

## 3. Whitelist IP addresses

1. Open Network Access in Atlas.
2. Click Add IP Address.
3. Add your current IP address or use 0.0.0.0/0 for development.
4. Save the entry.

> For local development, adding 0.0.0.0/0 is convenient but less secure. Use it only during development.

## 4. Get the connection string

1. Open your cluster and click Connect.
2. Choose Connect your application.
3. Select Node.js and the latest driver version.
4. Copy the connection string.

Example:

```text
mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
```

## 5. Create a .env file

Create a .env file in the project root:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
```

## 6. Install dependencies

Run:

```bash
npm install mongoose dotenv express
```

If you are using nodemon for development:

```bash
npm install -D nodemon
```

## 7. Create the database connection file

Use a file like config/db.js:

```js
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: true,
      retryWrites: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 8. Use the connection in server.js

```js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 9. Test the connection

Run:

```bash
node server.js
```

You should see output similar to:

```text
MongoDB Connected: cluster0-shard-00-00.mongodb.net
```

You can also test with:

```bash
curl http://localhost:5001/
```

## 10. Troubleshooting

### DNS / SRV lookup errors

Symptoms:
- `querySrv ENOTFOUND`
- `querySrv ECONNREFUSED`

Fix:
- Verify the cluster name in the connection string.
- Ensure DNS can resolve the host.
- Try using the latest connection string from Atlas.
- If you are on a corporate network, allow outbound DNS and MongoDB traffic.

### ECONNREFUSED

This usually means the network cannot reach the Atlas endpoint.

Fix:
- Confirm the IP is whitelisted.
- Confirm the cluster is online.
- Check firewall and proxy settings.

### ETIMEOUT

This usually indicates slow DNS resolution or network instability.

Fix:
- Increase `serverSelectionTimeoutMS`.
- Check internet connectivity.
- Use `family: 4` to prefer IPv4.

### MongooseServerSelectionError

This is a general connection selection error caused by network or authentication issues.

Fix:
- Verify the username and password in the connection string.
- Confirm the database user exists.
- Ensure the cluster is not paused.
- Check Atlas logs and connection status.

## 11. Latest Mongoose best practices

- Use `mongoose.set("strictQuery", true);`
- Keep the connection logic in a dedicated file such as config/db.js
- Use environment variables for secrets
- Avoid hard-coding credentials in the source code
- Use `serverSelectionTimeoutMS` and `socketTimeoutMS` for better connection resilience
- Prefer `family: 4` when DNS resolution is unstable
- Handle connection failures gracefully
- Use `maxPoolSize` to control connection pooling

## 12. Recommended package scripts

In package.json:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
