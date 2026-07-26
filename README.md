# Verified Social Commerce Platform

## Step 1 - Backend Foundation

### Folder Structure

```text
src/
  config/
    database.js
  controllers/
  models/
    User.js
    Post.js
  routes/
    healthRoutes.js
  middlewares/
  utils/
index.js
package.json
.env.example
```

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   copy .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### API Endpoints

- GET /api/health
- GET /
