# Planify - Project Management Tool

Planify is a project management tool designed to help organize tasks, projects, and team roles efficiently. The backend leverages the **NestJS framework**, with **MySQL** as the database and **Redis** for caching.

---

## Environment Configuration

To configure the project, create a `.env` file in the root directory with the following variables:

```dotenv
APP_PORT=5000

MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_PASSWORD=my_password
MYSQL_DB=planify_db

ACCESS_TOKEN_SECRET=yourAccessTokenSecretKey
ACCESS_TOKEN_EXPIRES_IN=40m

REFRESH_TOKEN_SECRET=yourRefreshTokenSecretKey
REFRESH_TOKEN_EXPIRES_IN=7d

OPEN_WEATHER_MAP_API_KEY=32c896c6b3b9a7efe2775a0f87ae337a

REDIS_HOST=redis
REDIS_PORT=6379 
REDIS_DB=0

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=example@gmail.com
EMAIL_PASS=your password
EMAIL_FROM_NAME=No Reply
EMAIL_FROM_ADDRESS=noreply@example.com

PROMETHEUS_PORT=9090
PROMETHEUS_TARGET=localhost:9090
GRAFANA_PORT=3000

```

---

## Build and Start the Project

To start the application, run the following command:

```bash
docker-compose up --build
```

### What This Command Does:
- Builds the Docker images for the application, MySQL, and Redis.
- Sets up and starts all the services.
- Automatically runs database migrations.

---

## Access the Application

Once everything is running, the application will be accessible at:

- **API Base URL**: [http://localhost:3000/api](http://localhost:3000/api)

---

## Available Commands

### Stop the Containers
To stop all running containers:
```bash
docker-compose down
```

### Rebuild the Containers
To rebuild the Docker images after changes:
```bash
docker compose up -d --build
```

### Run Database Migrations
To manually run migrations:
```bash
docker exec -it planify npx typeorm migration:run -d dist/src/database/data-source.js
```

---

## Project Structure

---

## Project Structure

```plaintext
.

├── src/
│   ├── common/           # Common utilities and helpers
│   ├── config/           # Configuration files
│   ├── core/             # Core functionality
│   ├── database/         # Database configuration
│   │   ├── data-source.ts
│   │   ├── database.providers.ts
│   │   ├── database.module.ts
│   ├── entities/         # TypeORM entities
│   ├── migrations/       # Database migrations
│   ├── modules/          # Application modules
│   ├── redis/            # Redis integration
│   ├── shared/           # Shared utilities and DTOs
│   ├── websocket/        # WebSocket handlers
│   ├── main.ts           # Application entry point
├── test/                 # Testing files
│   ├── app.e2e-spec.ts   # End-to-end test cases
├── Dockerfile            # Dockerfile for building the app
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com) - Official NestJS documentation.
- [Docker Documentation](https://docs.docker.com) - Comprehensive guide on Docker and Docker Compose.
- [TypeORM Documentation](https://typeorm.io) - Learn more about TypeORM and database migrations.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
