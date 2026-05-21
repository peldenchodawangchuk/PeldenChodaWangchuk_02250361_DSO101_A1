# Assignment III – GitHub Actions CI/CD with Docker & Render
### DSO101 | Bachelor of Engineering in Software Engineering

---

## Project Overview

This assignment configures a **GitHub Actions** workflow to automate:
1. Building a Docker container for the Node.js Todo application
2. Pushing the container image to DockerHub
3. Deploying the container to **Render.com**

---

## Tools & Technologies

| Tool | Purpose |
|------|---------|
| GitHub | Source code hosting & version control |
| GitHub Actions | CI/CD automation workflow |
| Docker | Containerization |
| DockerHub | Container image registry |
| Render.com | Cloud deployment platform |
| Node.js & npm | Backend runtime & package management |
| Jest | Unit testing framework |

---

## Repository Structure

```
PeldenChodaWangchuk_02250361_DSO101_A1/
├── .github/
│   └── workflows/
│       └── deploy.yml         ← GitHub Actions workflow
├── Assignment3/
│   ├── src/
│   │   └── index.js           ← Express app entry point
│   ├── tests/
│   │   └── todo.test.js       ← Jest unit tests
│   ├── Dockerfile             ← Docker image definition
│   ├── package.json           ← Node.js project config
│   └── README.md              ← This file
```

---

## Steps Taken

### Task 1: GitHub Repository Setup

- Verified the repository is public on GitHub
- Confirmed `package.json` includes the required scripts:
  - `start` — runs the Node.js app
  - `test` — runs Jest unit tests with JUnit reporting
  - `build` — build step

### Task 2: Dockerfile Setup

Created `Assignment3/Dockerfile` following the assignment specification:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test
EXPOSE 3000
CMD ["npm", "start"]
```

Key addition: `RUN npm test` runs unit tests during the Docker build process, ensuring only a passing image gets deployed.

Also updated `src/index.js` to add a root route and use `process.env.PORT` for Render compatibility:

```javascript
app.get('/', (req, res) => {
    res.json({ message: 'Todo App is running!', status: 'ok' });
});
```

### Task 3: GitHub Actions Workflow

Created `.github/workflows/deploy.yml` at the repo root with 4 steps:

```yaml
name: Build and Deploy Todo App

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Docker Image
        run: |
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest ./Assignment3
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest

      - name: Trigger Render Deployment
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

Added the following GitHub repository secrets:

| Secret | Purpose |
|--------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub account username |
| `DOCKERHUB_TOKEN` | Docker Hub personal access token (Read & Write) |
| `RENDER_DEPLOY_HOOK_URL` | Render.com deploy webhook URL |

### Task 4: Render.com Deployment

1. Logged into Render.com
2. Created a new **Web Service**
3. Selected **"Deploy from existing image"**
4. Used Docker image: `maxandcheese/todo-app:latest`
5. Copied the **Deploy Hook URL** from Render Settings
6. Added it as `RENDER_DEPLOY_HOOK_URL` in GitHub Secrets

---

## How the Pipeline Works

Every time code is pushed to the `main` branch:

1. GitHub Actions checks out the latest code
2. Logs into DockerHub using stored secrets
3. Builds the Docker image from `Assignment3/Dockerfile` (runs tests inside the build)
4. Pushes the image to DockerHub
5. Calls the Render deploy hook via `curl`, triggering a redeployment
6. Render pulls the new image and restarts the service

---

## Tests

**Framework:** Jest with jest-junit reporter

```
PASS tests/todo.test.js
  Todo App Tests
    ✓ should create a todo item
    ✓ should mark a todo as done
    ✓ should store multiple todos

Tests: 3 passed, 3 total
```

---

## Challenges Faced

1. **`Cannot GET /` on Render** — The Express app had no root route defined. Fixed by adding `app.get('/')` returning a JSON status response.

2. **Render PORT mismatch** — Render assigns a dynamic port via `process.env.PORT`. The app was hardcoded to port 3000. Fixed by using `process.env.PORT || 3000`.

3. **Docker Hub token permissions** — The initial token had read-only permissions. Had to regenerate a new token with **Read & Write** access for the push to succeed.

4. **Workflow not triggering** — The `.github/workflows/` folder must be in the **repo root**, not inside the Assignment3 subfolder. Moving it to the correct location fixed the trigger.

5. **Render deploy hook** — Render does not automatically redeploy when a new Docker image is pushed to DockerHub. A deploy hook URL must be called explicitly via `curl` in the workflow.

---

## Learning Outcomes

- Learned how to set up **GitHub Actions** workflows for automated CI/CD
- Understood how to securely store credentials using **GitHub Secrets**
- Gained experience building and pushing **Docker images** in a CI pipeline
- Learned how to deploy containerized apps to **Render.com** using deploy hooks
- Understood the importance of `process.env.PORT` for cloud deployments
- Learned that running tests inside the Dockerfile (`RUN npm test`) ensures only verified images get deployed

---

##Screenshots

##GitHub Actions success

---

## Links

- **GitHub Repository:** `https://github.com/peldenchodawangchuk/PeldenChodaWangchuk_02250361_DSO101_A1`
- **Docker Hub Image:** `https://hub.docker.com/r/maxandcheese/todo-app`
- **Live Render Deployment:** `https://todo-app-rcai.onrender.com`

---

## Deliverables Checklist

- [x] `.github/workflows/deploy.yml` in repo root
- [x] `Assignment3/Dockerfile` with `RUN npm test`
- [x] GitHub Actions workflow running successfully
- [x] Docker image pushed to DockerHub
- [x] App deployed and live on Render.com
- [x] README.md with steps, challenges, and learning outcomes

---

*Submitted for DSO101 – Continuous Integration and Continuous Deployment*
*Bachelor of Engineering in Software Engineering*
