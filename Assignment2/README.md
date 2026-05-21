# Assignment II – CI/CD Pipeline with Jenkins
### DSO101 | Bachelor of Engineering in Software Engineering

---

## Project Overview

This project demonstrates the setup of a **Continuous Integration and Continuous Deployment (CI/CD)** pipeline using Jenkins to automate the build, testing, and deployment of a Node.js To-Do List application.

The pipeline automates:
- Code checkout from GitHub
- Dependency installation via npm
- Application build
- Unit testing with Jest (JUnit reports)
- Docker image build and push to Docker Hub

---

## Tools & Technologies

| Tool | Purpose |
|------|---------|
| Jenkins | CI/CD automation server |
| GitHub | Source code hosting & version control |
| Node.js & npm | JavaScript runtime & package management |
| Jest + jest-junit | Unit testing & JUnit report generation |
| Docker | Containerization and deployment |
| Docker Hub | Container image registry |

---

## Repository Structure

```
assignment1-node-app/
├── src/
│   ├── index.js          # Application entry point
│   └── todo.js           # Todo logic module
├── tests/
│   └── todo.test.js      # Unit tests (Jest)
├── Dockerfile            # Docker image definition
├── Jenkinsfile           # Jenkins pipeline definition
├── package.json          # Node.js project config & scripts
└── README.md             # This file
```

---

## Pipeline Configuration

### Jenkins Setup (Windows)

1. Downloaded Jenkins from [jenkins.io/download](https://jenkins.io/download) (Windows .msi installer)
2. Installed and ran Jenkins on `http://localhost:8080`
3. Unlocked using the initial admin password from `C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword`
4. Installed the following plugins via **Manage Jenkins → Plugins**:
   - NodeJS Plugin
   - Pipeline
   - GitHub Integration
   - Docker Pipeline
   - JUnit Plugin

5. Configured Node.js under **Manage Jenkins → Tools → NodeJS Installations**:
   - Name: `NodeJS`
   - Version: LTS v20.x

### GitHub Credentials

- Generated a **Personal Access Token (PAT)** from GitHub with `repo` and `admin:repo_hook` permissions
- Added credentials in Jenkins under **Manage Jenkins → Credentials**:
  - Kind: Username with password
  - ID: `github-creds`

### Docker Hub Credentials

- Added Docker Hub credentials in Jenkins:
  - Kind: Username with password
  - ID: `docker-hub-creds`

### Pipeline Setup

Created a new **Pipeline** item in Jenkins with:
- Definition: `Pipeline script from SCM`
- SCM: Git
- Repository URL: `https://github.com/yourusername/assignment1-node-app`
- Credentials: `github-creds`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

---

## Jenkinsfile – Pipeline Stages

```groovy
pipeline {
    agent any
    tools { nodejs 'NodeJS' }
    environment {
        DOCKERHUB_USERNAME = 'maxandcheese'
        IMAGE_NAME = 'todo-app'
        IMAGE_TAG = 'latest'
    }
    stages {
        stage('Checkout')  { ... }   // Pull code from GitHub
        stage('Install')   { ... }   // npm install
        stage('Build')     { ... }   // npm run build
        stage('Test')      { ... }   // npm test + JUnit report
        stage('Deploy')    { ... }   // Docker build + push
    }
}
```

Each stage is described in detail below:

| Stage | Command | Description |
|-------|---------|-------------|
| Checkout | `git branch: 'main'` | Pulls latest code from GitHub |
| Install | `bat 'npm install'` | Installs all npm dependencies |
| Build | `bat 'npm run build'` | Compiles/prepares the application |
| Test | `bat 'npm test'` | Runs Jest tests, publishes JUnit XML |
| Deploy | `docker.build(...)` | Builds and pushes Docker image to Docker Hub |

---

##  Testing

**Framework used:** [Jest](https://jestjs.io/) with [jest-junit](https://github.com/jest-community/jest-junit) for JUnit-compatible reports.

### Setup

```bash
npm install --save-dev jest jest-junit
```

### package.json scripts

```json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "echo 'Build step complete'",
    "test": "jest --ci --reporters=default --reporters=jest-junit"
  }
}
```

### Running Tests Locally

```bash
npm test
```

Test results are published to Jenkins under **Test Results** after each build.

---

## Docker

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Hub Image

The image is automatically built and pushed to Docker Hub on every successful pipeline run:

```
https://hub.docker.com/r/maxandcheese/todo-app

```

To pull and run the image locally:

```bash
docker pull your-dockerhub-username/todo-app:latest
docker run -p 3000:3000 your-dockerhub-username/todo-app:latest
```

---

## Expected Pipeline Output

A successful run shows the following in Jenkins:

- **Checkout** – Code pulled from GitHub main branch
- **Install** – All npm packages installed without errors
- **Build** – Build step completed
- **Test** – All unit tests passed; JUnit report available in Jenkins
- **Deploy** – Docker image built and pushed to Docker Hub

---

## Challenges Faced

1. **Windows vs Linux shell commands** — Jenkins uses `sh` by default (Linux). On Windows, `bat` must be used instead. This required updating all shell steps in the Jenkinsfile from `sh` to `bat`.

2. **JUnit report path** — The `jest-junit` reporter generates `junit.xml` at the project root. The Jenkinsfile must reference this exact path in the `junit` post step.

3. **Docker on Windows** — Docker Desktop must be running before Jenkins can build images. Jenkins also needs to be configured to access the Docker daemon socket.

4. **GitHub PAT permissions** — The Personal Access Token must include both `repo` and `admin:repo_hook` scopes; missing either causes webhook or checkout failures.

5. **NodeJS tool name mismatch** — The name defined in **Manage Jenkins → Tools** must exactly match the name used in the `tools { nodejs '...' }` block in the Jenkinsfile (case-sensitive).

---

## Deliverables Checklist

- [x] Jenkinsfile committed to GitHub repo root
- [x] Dockerfile committed to GitHub repo root
- [x] Screenshot: Successful pipeline execution (stage view)
- [x] Screenshot: Test results in Jenkins
- [x] Screenshot: Docker Hub image page
- [x] GitHub repo link with all files
- [x] README.md with pipeline explanation and challenges

---

## Links

- **GitHub Repository:** `https://github.com/peldenchodawangchuk/PeldenChodaWangchuk_02250361_DSO101_A1/tree/main/Assignment2`
- **Docker Hub Image:** `https://hub.docker.com/r/maxandcheese/todo-app`

---

*Submitted for DSO101 – Continuous Integration and Continuous Deployment*  
*Bachelor of Engineering in Software Engineering*  
