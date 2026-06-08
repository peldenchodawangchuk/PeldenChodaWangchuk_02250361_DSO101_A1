# DSO101 Notes

| | |
|---|---|
| **Course** | DSO101 - Continuous Integration and Continuous Deployment |
| **Program** | Bachelor's of Engineering in Software Engineering (SWE) |
| **Student** | Pelden Choda Wangchuk |
| **Student ID** | 02250361 |
| **GitHub Repository** | [PeldenChodaWangchuk_02250361_DSO101](https://github.com/peldenchodawangchuk/PeldenChodaWangchuk_02250361_DSO101_A1) |

---

# Unit 1: Introduction to Docker

## What is Docker?

Docker is an open-source platform used to develop, ship, and run applications inside isolated environments called **containers**. Containers package an application with all its dependencies, ensuring consistency across different environments.

---

## Why Use Docker?

- Eliminates the "works on my machine" problem by ensuring applications run the same way everywhere
- Uses fewer system resources compared to conventional virtual machines
- Speeds up development, testing, and deployment
- Makes it easy to scale applications up or down as demand changes

---

## Docker vs Virtual Machines

| Feature | Docker (Containers) | Virtual Machines |
|---------|---------------------|-----------------|
| Size | Lightweight | Heavy |
| Boot Time | Seconds | Minutes |
| Performance | Near-native | Slower |
| Isolation | Process-level | Full OS |

---

## Docker Architecture

- **Docker Client** – The command-line interface that lets users interact with Docker
- **Docker Daemon** – The background service responsible for running and managing containers
- **Docker Images** – Read-only blueprints or templates that define what a container looks like
- **Docker Containers** – Live, running instances created from a Docker image

---

## Basic Commands

```cmd
docker --version
docker info
docker help
```

> **Screenshot:** `docker --version` output *(add screenshot here)*

---

## Docker Lab 1 — Basic Commands

Lab consists of 17 questions. Answers submitted below by question number.

| # | Answer |
|---|--------|
| 1 | 25.0.5 |
| 2 | 0 |
| 3 | 9 |
| 4 | *(add screenshot)* |
| 5 | *(add screenshot)* |
| 6 | 0 |
| 7 | 4 |
| 8 | 6 |
| 9 | nginx:alpine |
| 10 | awesome_northcut |
| 11 | 866 |
| 12 | Exited |
| 13–16 | *(add screenshots)* |

**Lab Completion Screenshot:** *(add screenshot)*

---

# Unit 2: Docker Images and Containers

## Docker Images

A Docker image is a **read-only template** used as the foundation for creating containers. Think of it as a snapshot of your application and its environment, frozen in time and ready to be deployed.

> **Screenshot:** Docker images list *(add screenshot)*

---

## Docker Containers

A container is the **live, running instance** of a Docker image. Once you spin up a container from an image, it becomes an active, isolated process running your application.

> **Screenshot:** Running containers *(add screenshot)*

---

## Essential Commands

```cmd
docker run <image>
docker ps
docker ps -a
docker stop <container>
docker start <container>
docker restart <container>
docker rm <container>
docker images
docker rmi <image>
```

---

## Running Containers

```cmd
docker run nginx
docker run -it ubuntu bash
```

---

## Port Mapping

Map a port on your local machine to a port inside the container so you can access services from your browser.

```cmd
docker run -p 8080:80 nginx
```

---

## Detached Mode

Run a container in the background so it doesn't block your terminal.

```cmd
docker run -d nginx
```

---

## Viewing Logs

```cmd
docker logs <container_id>
```

---

## Docker Exec — Running Commands Inside Containers

`docker exec` lets you run commands directly inside an already-running container — useful for debugging or inspecting the container's internal state.

### Check the OS inside a container

```cmd
docker exec <container_id> cat /etc/os-release
```

### Open an interactive shell

```cmd
docker exec -it <container_id> bash
```

---

## Docker Lab 2 — Docker Images

| # | Answer |
|---|--------|
| 1 | 9 |
| 2 | 7.81 MB |
| 3 | 1.14 - alpine |
| 4 | python:3.6 |
| 5 | /opt |
| 6 | python app.py |
| 7 | 8080 |
| 8 | *(add screenshot)* |
| 9 | `docker run -p 8282:8080 webapp-color` |
| 10 | correct - ok |
| 11 | Debian |
| 12 | 920 MB |
| 13–15 | *(add screenshots)* |

**Lab Completion Screenshot:** *(add screenshot)*

---

# Unit 3: Dockerfile and Docker Compose

## What is a Dockerfile?

A Dockerfile is essentially a recipe — a plain text script containing a sequence of instructions that Docker follows step by step to build a custom image. Every line in a Dockerfile adds a new layer to the image.

> **Screenshot:** Dockerfile example *(add screenshot)*

---

## Sample Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

---

## Build an Image from a Dockerfile

```cmd
docker build -t my-app .
```

The `-t` flag lets you name the image. The `.` tells Docker to look for the Dockerfile in the current directory.

---

## Run Your Built Image

```cmd
docker run -p 3000:3000 my-app
```

---

## Docker Compose

Docker Compose is a tool for defining and running **multi-container** applications. Instead of running multiple `docker run` commands manually, you describe your entire application stack in a single `docker-compose.yml` file.

---

## Example docker-compose.yml

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"

  app:
    build: .
    ports:
      - "3000:3000"
```

---

## Docker Compose Commands

```cmd
docker-compose up
docker-compose down
docker-compose build
```

---

## Volumes (Data Persistence)

By default, data inside a container is lost when the container stops. Volumes solve this by mounting persistent storage that survives container restarts.

```cmd
docker run -v myvolume:/data nginx
```

---

## Networks

Docker networks allow containers to communicate with each other securely.

```cmd
docker network ls
docker network create mynetwork
```

---

## Optimizing Docker Images for Production

### Multi-Stage Build (Smaller Image)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]
```

### .dockerignore (Create this file in your project root)

```text
node_modules/
.git/
.env
*.log
```

### Non-Root User (Security)

```dockerfile
RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001
USER appuser
```

### Image Scanning

```cmd
docker scout quick my-app
```

### Resource Limits

```cmd
docker run --memory="512m" --cpus="1" --read-only my-app
```

---

# Unit 4: CI/CD and Jenkins

## What is CI/CD?

**Continuous Integration (CI)** — Developers merge code into a shared branch multiple times a day. Each merge triggers an automatic build and test run, catching issues early before they snowball.

**Continuous Delivery** — Code is always in a deployable state, but a human manually approves and pushes the final release to production. Good for teams that need a sign-off step.

**Continuous Deployment** — Fully automated. Every change that passes all tests goes straight to production with no human click needed.

### The Pipeline Flow

```
Commit → Build → Unit Tests → Integration Tests → Deploy to Staging → (Manual Approval) → Production
```

### Why Use CI/CD?

- Catch bugs early when they're cheap to fix
- Deploy more often with less stress
- Eliminate repetitive manual testing and release steps
- Build team confidence to ship anytime

### Challenges

- Takes time to set up properly upfront
- Relies on good test coverage — a pipeline is only as strong as its tests
- Teams need to adapt their development workflow and habits

---

## Jenkins Architecture

### Master (Controller)

The Jenkins master is the brain of the operation. It handles scheduling jobs, serving the web UI (port 8080), storing configuration, and coordinating agents — but does no actual building itself.

### Agents (Nodes)

Agents are the workers. They receive instructions from the master and execute builds and tests. You can have multiple agents running on different operating systems. More agents = more parallel builds.

> **Why separate?** The master stays lean while agents handle the heavy lifting. You can scale agents independently based on workload.

---

## Jenkins Job Types

### Freestyle Project

- Configured entirely through the web UI
- Simple and beginner-friendly
- Not version-controlled, so changes aren't tracked
- Gradually being replaced by pipeline-based approaches

### Pipeline (Recommended)

- Build logic defined in a `Jenkinsfile` stored in your repository
- Treated like any other code — reviewable, versioned, auditable
- Survives Jenkins restarts without losing state

### Multibranch Pipeline

- Automatically discovers branches and creates a pipeline for each one
- Main branch can deploy to production; feature branches run tests first

---

## Jenkinsfile Basics (Declarative Syntax)

```groovy
pipeline {
    agent any  // Run on any available agent

    stages {
        stage('Build') {
            steps {
                echo 'Compiling source code...'
                sh 'mvn compile'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Package') {
            steps {
                sh 'mvn package'
            }
        }
    }

    post {
        always {
            echo 'This runs no matter what'
            junit '**/surefire-reports/*.xml'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Something broke — check the logs'
        }
    }
}
```

### Key Sections

| Section | Purpose |
|---------|---------|
| `agent` | Where to run (`any`, `label`, `docker`, `none`) |
| `stages` | Container for all stage blocks |
| `stage` | A logical phase like Build, Test, or Deploy |
| `steps` | The actual shell commands to execute |
| `post` | Cleanup or notifications based on outcome |

---

## Build Triggers

| Trigger | How it works |
|---------|--------------|
| Poll SCM | Jenkins periodically checks Git for new commits |
| GitHub Webhook | GitHub notifies Jenkins instantly on every push |
| Build periodically | Cron schedule (e.g., nightly at 2 AM) |
| Upstream trigger | Starts automatically after another job finishes |
| Generic trigger | Any external system can call the Jenkins API |

---

## Plugins

Jenkins is a minimal engine out of the box — plugins are what give it power.

### Essential Plugins

| Plugin | Purpose |
|--------|---------|
| Git | Clone and interact with Git repositories |
| Pipeline | Enable Jenkinsfile-based pipelines |
| JUnit | Parse test results and show pass/fail trends |
| Blue Ocean | Modern, visual pipeline UI |
| Docker | Build images and run containers as build steps |
| Slack / Email | Send build notifications to your team |

**To install:** `Manage Jenkins → Plugins → Available tab → Search → Install`

---

## Build Steps and Post-Build Actions

**Build steps** are the core actions in your pipeline:
- Execute shell scripts
- Run Maven, Gradle, or npm commands
- Invoke other Jenkins jobs
- Copy or archive files

**Post-build actions** run after the main build:
- Publish test reports to track quality trends
- Archive build artifacts (JAR, WAR files)
- Send failure notifications
- Trigger downstream jobs
- Deploy to a server

---

## GitHub Actions

CI/CD platform built directly into GitHub — no external server needed.

### Core Concepts

| Concept | Meaning |
|---------|---------|
| Workflow | YAML file in `.github/workflows/` |
| Event | Trigger (push, pull_request, etc.) |
| Job | Set of steps on one runner |
| Action | Reusable component |

### Example Workflow (.github/workflows/deploy.yml)

```yaml
name: CI/CD
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            git pull
            docker-compose up -d --build
```

### Setup Secrets (GitHub UI)

`Settings → Secrets → Actions → New repository secret`

| Secret | Value |
|--------|-------|
| HOST | Your server IP |
| USER | SSH username |
| SSH_KEY | Your private key |

### Common Triggers

```yaml
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:   # Manual trigger button
```

---

# Unit 5: Advanced Pipelines

## What is a Pipeline?

A pipeline is a continuous flow of automation — from code commit all the way to deployment.

---

## Declarative vs Scripted Pipeline

### Declarative (Recommended)

- Clean, opinionated structure that's easy to read and write
- Integrates with Blue Ocean's visual editor
- Best for 80%+ of use cases

### Scripted

- Full Groovy programming language — unrestricted flexibility
- Native loops, conditionals, and error handling
- Steeper learning curve; use when Declarative hits its limits

### Side-by-Side Comparison

**Declarative:**

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps { sh 'make' }
        }
    }
}
```

**Scripted:**

```groovy
node('any') {
    stage('Build') {
        sh 'make'
        if (currentBuild.result == 'SUCCESS') {
            echo 'Build good'
        }
    }
}
```

### When to Use Which

| Scenario | Recommendation |
|----------|----------------|
| New to Jenkins | Start with Declarative |
| Need complex conditionals or loops | Use Scripted |
| Building shared pipeline libraries | Scripted works better |
| Most production pipelines | Declarative is sufficient |

---

## Pipeline as Code

Your pipeline definition lives **in your repository**, not buried in the Jenkins web UI.

### Why It Matters

- Pipeline changes go through pull requests and code review
- Each branch can have its own pipeline behavior
- Full history of every pipeline change
- Rollback a bad pipeline change like any other code

### Using a Shared Library

```groovy
@Library('my-shared-library') _

pipeline {
    stages {
        stage('Deploy') {
            steps {
                slackNotify('Deploying to production')
            }
        }
    }
}
```

---

## Integrating External Tools

### Source Control (Git)

```groovy
stage('Checkout') {
    steps {
        git branch: 'main',
            url: 'https://github.com/myorg/myapp.git',
            credentialsId: 'github-creds'
    }
}
```

### Build Tools

**Maven:**

```groovy
stage('Build') {
    steps { sh 'mvn clean package' }
}
```

**Node.js / npm:**

```groovy
stage('Build') {
    steps {
        sh 'npm ci'
        sh 'npm run build'
    }
}
```

### Artifact Repositories (Nexus / Artifactory)

```groovy
stage('Upload Artifact') {
    steps {
        sh 'curl -u user:pass --upload-file myapp.war http://nexus/releases/'
    }
}
```

---

## Testing in Pipelines

### Unit Tests

```groovy
stage('Unit Tests') {
    steps {
        sh 'mvn test'
    }
    post {
        always {
            junit 'target/surefire-reports/*.xml'
        }
    }
}
```

The `junit` step parses test results and displays pass/fail trends over time. Failing tests turn the build **yellow (unstable)** rather than **red (failed)**.

### Test Types at a Glance

| Test Type | Speed | What It Catches |
|-----------|-------|-----------------|
| Unit | Fast | Logic bugs in isolated functions |
| Integration | Medium | Communication issues between services |
| E2E | Slow | Real user-facing workflow failures |

---

## Common Pipeline Patterns

### Parallel Execution

Run multiple test suites simultaneously to cut down on total pipeline time.

```groovy
stage('Parallel Tests') {
    parallel {
        stage('Unit') {
            steps { sh 'npm run test:unit' }
        }
        stage('Integration') {
            steps { sh 'npm run test:integration' }
        }
        stage('E2E') {
            steps { sh 'npm run test:e2e' }
        }
    }
}
```

### Conditional Execution

Only run a stage under specific conditions, like deploying only from the `main` branch.

```groovy
stage('Deploy') {
    when { branch 'main' }
    steps { sh 'deploy.sh' }
}
```

### Post Actions

Run cleanup or notifications regardless of whether the build passed or failed.

```groovy
post {
    always {
        echo 'Cleaning up workspace...'
        cleanWs()
    }
    success { echo 'Build passed!' }
    failure { echo 'Build failed — check the logs' }
}
```

### Environment Variables

Define reusable values at the top of the pipeline to avoid repetition.

```groovy
pipeline {
    environment {
        APP_NAME = 'myapp'
        VERSION  = '1.0.0'
    }
    stages {
        stage('Print Info') {
            steps {
                echo "Building ${APP_NAME} version ${VERSION}"
            }
        }
    }
}
```

### Credentials Management

Never hardcode passwords or API keys. Use Jenkins' built-in credentials store.

```groovy
pipeline {
    environment {
        DOCKER_PASSWORD = credentials('docker-hub-creds')
    }
    stages {
        stage('Docker Login') {
            steps {
                sh 'echo $DOCKER_PASSWORD | docker login -u myuser --password-stdin'
            }
        }
    }
}
```

### Manual Approval Gates

Pause the pipeline and wait for a human to approve before proceeding — ideal for production deployments.

```groovy
stage('Deploy to Production') {
    input {
        message "Ready to deploy to production?"
        ok "Yes, deploy now"
        submitter "admin"
    }
    steps {
        sh 'deploy-prod.sh'
    }
}
```

---

## Best Practices Summary

| Practice | Why It Matters |
|----------|----------------|
| Store Jenkinsfile in version control | Enables code review and full change history |
| Use Declarative pipeline syntax | More readable and easier to maintain |
| Run tests in parallel | Reduces total pipeline execution time |
| Publish test results | Track quality trends over time |
| Use the Credentials plugin | Keeps secrets out of your codebase |
| Clean workspace after builds | Prevents disk space issues on agents |
| Use shared libraries | Promote reuse, avoid copy-paste pipelines |

---

## References

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- [Blue Ocean UI](https://www.jenkins.io/projects/blueocean/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
