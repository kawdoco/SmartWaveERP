# SmartWave ERP Backend

Spring Boot backend API for the SmartWave ERP system - a barcode-based solution for textile retailers.

## Tech Stack

- **Java**: 17 LTS
- **Framework**: Spring Boot 3.2.2
- **Build Tool**: Maven
- **Database**: PostgreSQL (via Supabase)
- **Security**: Spring Security
- **ORM**: Spring Data JPA / Hibernate

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL database (Supabase connection)

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/smartwave/erp/
│   │   │   ├── SmartWaveErpApplication.java   # Main application class
│   │   │   ├── config/                         # Configuration classes
│   │   │   │   ├── WebConfig.java             # CORS configuration
│   │   │   │   └── SecurityConfig.java        # Security configuration
│   │   │   ├── controller/                     # REST controllers
│   │   │   │   ├── HealthController.java      # Health check endpoint
│   │   │   │   ├── purchasing/                # Purchasing module
│   │   │   │   ├── inventory/                 # Inventory module
│   │   │   │   └── pos/                       # POS module
│   │   │   ├── service/                       # Business logic layer
│   │   │   ├── repository/                    # Data access layer
│   │   │   ├── model/
│   │   │   │   ├── entity/                    # JPA entities
│   │   │   │   └── dto/                       # Data transfer objects
│   │   │   ├── exception/                     # Custom exceptions
│   │   │   └── util/                          # Utility classes
│   │   └── resources/
│   │       ├── application.properties          # Main configuration
│   │       ├── application-dev.properties      # Development config
│   │       └── application-prod.properties     # Production config
│   └── test/                                   # Test classes
└── pom.xml                                     # Maven dependencies
```

## Getting Started

### 1. Install Dependencies

```bash
mvn clean install
```

### 2. Configure Database

Update environment variables or modify `application.properties`:

```properties
DATABASE_URL=jdbc:postgresql://your-supabase-url:5432/smartwave_erp
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
```

### 3. Run the Application

```bash
# Development mode (with hot reload)
mvn spring-boot:run

# Or specify profile explicitly
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at: `http://localhost:8080/api`

### 4. Verify Health

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "timestamp": "2026-02-17T...",
    "service": "SmartWave ERP Backend",
    "version": "0.0.1-SNAPSHOT"
  },
  "timestamp": "2026-02-17T..."
}
```

## Available Maven Commands

```bash
# Compile the project
mvn compile

# Run tests
mvn test

# Package as JAR
mvn package

# Clean build artifacts
mvn clean

# Run application
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Development

### Running in Development Mode

The application is configured with `dev` profile by default, which includes:
- Detailed error messages
- SQL query logging
- Debug level logging for Spring Security

### Hot Reload

Spring Boot DevTools is included and provides automatic restart when code changes are detected.

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Future Modules
- `/api/auth` - Authentication endpoints
- `/api/purchasing` - Purchasing management
- `/api/inventory` - Inventory tracking
- `/api/pos` - Point of Sale operations
- `/api/reports` - Business reports

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/smartwave_erp` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `password` |
| `SPRING_PROFILE` | Active Spring profile | `dev` |

## Security

Currently configured with permissive access for development. Production deployment will require:
- JWT authentication implementation
- Role-based access control (RBAC)
- API rate limiting
- HTTPS enforcement

## Next Steps

- [ ] Set up Supabase PostgreSQL database
- [ ] Implement JWT authentication
- [ ] Create entity models for domain objects
- [ ] Build RESTful API endpoints
- [ ] Add comprehensive testing
- [ ] Configure production deployment
