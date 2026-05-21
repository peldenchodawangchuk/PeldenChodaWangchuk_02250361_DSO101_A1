# Todo App – DSO101 Assignment I

A full-stack to-do list application with React frontend, Node.js/Express backend, and PostgreSQL database. Deployed using Docker on Render.com.

---

## Live URLs

| Service | URL |
|---|---|
| Frontend | https://fe-todo-02250361.onrender.com |
| Backend API | https://be-todo-02250361.onrender.com  |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── server.js              # Express CRUD API
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example           # Template – copy to .env locally
│   └── .env.production        # Production env comments
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── api.js             # API service layer
│   │   ├── index.js
│   │   └── index.css          # Tailwind CSS entry
│   ├── public/
│   │   └── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .env.production
├── render.yaml                # Render Blueprint (Part B)
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS 3 |
| Backend | Node.js 18, Express.js |
| Database | PostgreSQL (Render managed) |
| Containerization | Docker |
| Deployment | Render.com |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker Desktop
- PostgreSQL (local instance or Docker)

### 1. Clone the repository
```bash
git clone https://github.com/peldenchodawangchuk/PeldenChodaWangchuk_02250361_DSO101_A1.git
mkdir todo-app
cd todo-app
```

### 2. Set up Backend
```bash
cd backend
cp  .env
# Edit .env with your local DB credentials
npm install
node server.js
```
Backend runs at `http://localhost:5000`

### 3. Set up Frontend
```bash
cd frontend
cp .env.example .env
# .env should contain: REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## Part A: Deploy Pre-Built Docker Image to Docker Hub

### Step 1: Build images with your student ID as tag

```bash
# From project root

# Backend
docker build -t maxandcheese/be-todo:02250361./backend
docker push maxandcheese/be-todo:02250361

# Frontend
docker build -t maxandcheese/fe-todo:02250361 ./frontend
docker push maxandcheese/fe-todo:02250361
```


### Step 2: Create Render PostgreSQL Database
1. Go to [render.com](https://render.com) → New → PostgreSQL
2. Name it `todo-db`, choose the Free plan
3. Copy the connection details (host, user, password, database name)

### Step 3: Deploy Backend on Render
1. Go to Render → New → **Web Service**
2. Select **"Existing image from Docker Hub"**
3. Image: `maxandcheese/be-todo:02250361`
4. Add Environment Variables:

| Key | Value |
|---|---|
| `DB_HOST` | *(from Render PostgreSQL dashboard)* |
| `DB_USER` | *(from Render PostgreSQL dashboard)* |
| `DB_PASSWORD` | *(from Render PostgreSQL dashboard)* |
| `DB_NAME` | `tododb` |
| `DB_PORT` | `5432` |
| `DB_SSL` | `true` |
| `PORT` | `5000` |


### Step 4: Deploy Frontend on Render
1. Render → New → **Web Service** → Existing Docker Hub image
2. Image: `maxandcheese/fe-todo:02250361`
3. Add Environment Variable:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://be-todo.onrender.com` |

---

##  Part B: Automated Image Build and Deployment

Part B uses the `render.yaml` Blueprint so that every `git push` to `main` triggers a fresh build and redeploy automatically.

### Step 1: Connect repo to Render via Blueprint
1. Go to [render.com](https://render.com) → New → **Blueprint**
2. Connect your GitHub repository
3. Render auto-detects `render.yaml` and provisions all services


### Step 2: Set secret environment variables in Render dashboard
Since `render.yaml` uses `fromDatabase` references, DB credentials are injected automatically. Only set these manually if needed:
- `DB_SSL=true`
- `FRONTEND_URL=https://fe-todo-02250361.onrender.com`

### Step 3: Test auto-deploy
Make any change to your code and push:
```bash
git add .
git commit -m "test: trigger auto deploy"
git push origin main
```

Render will automatically build a new Docker image and redeploy.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

**Example POST body:**
```json
{
  "title": "Complete DSO101 Assignment",
  "description": "Deploy app to Render using Docker"
}
```

---

## Environment Variables

### Backend `.env`
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=tododb
DB_PORT=5432
DB_SSL=false
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000
```

> **Never commit `.env` files to Git.** They are listed in `.gitignore`.

---

## Common Errors & Fixes

| Problem | Solution |
|---|---|
| Backend can't connect to DB | Check `DB_HOST`, `DB_SSL=true` on Render |
| Frontend shows blank / API errors | Ensure `REACT_APP_API_URL` points to live backend URL |
| Docker build fails | Run `npm install` locally to catch missing deps first |
| Render deploy fails | Check build logs in Render dashboard |
| Image not found on Docker Hub | Make sure you ran `docker push` before deploying on Render |

---

DSO101 – Continuous Integration and Continuous Deployment
Bachelor of Engineering in Software Engineering (SWE)