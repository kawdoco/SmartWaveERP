# SmartWave ERP - Enterprise Resource Planning System

## 📋 Project Description

**SmartWave ERP** is a specialized barcode-based system designed for textile retailers that streamlines business operations through:

- **📦 Purchasing Management**: Complete management of finished garments procurement
- **🏷️ Inventory Tracking**: Advanced inventory control by size and color variations
- **💳 POS Integration**: Point-of-sale system for efficient retail transactions
- **⚡ Real-Time Updates**: Automatic stock updates with every transaction
- **✅ Error Reduction**: Barcode scanning minimizes manual entry errors
- **📊 Reporting**: Accurate sales analytics and stock reports for informed decision-making
- **⚙️ Operational Efficiency**: Streamlined workflows for improved productivity

This system is purpose-built to address the unique challenges of textile retail, where managing multiple SKUs with size and color variants is critical for business success.

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend for the SmartWave ERP system.

```
SmartWaveERP/
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/      # App Router pages
│   ├── public/       # Static assets
│   └── package.json
├── backend/          # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/smartwave/erp/  # Java source code
│   │   └── resources/                    # Configuration files
│   └── pom.xml       # Maven dependencies
└── docs/            # Documentation
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: React 19

### Backend
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17 LTS
- **Build Tool**: Maven
- **Database**: PostgreSQL (Supabase)
- **Security**: Spring Security
- **ORM**: Spring Data JPA

## 📦 Frontend Setup

The frontend has been initialized with Next.js. To get started:

```bash
cd frontend
npm install    # Already done
npm run dev    # Start development server
```



## 📦 Backend Setup

The backend has been initialized with Spring Boot. To get started:

```bash
cd backend
mvn clean install      # Install dependencies
mvn spring-boot:run    # Start development server
```

The API will be available at `http://localhost:8080/api`

### Verify Backend Health

```bash
curl http://localhost:8080/api/health
```

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL database (to be configured with Supabase)
###✅ Initialize Spring Boot project
2. ✅ Configure Spring Security (permissive mode for development)
3. ✅ Set up CORS for frontend integration
4. ✅ Create health check endpoint
5. Set up PostgreSQL connection with Supabase
6. Implement JWT authentication
7. Create entity models for domain objects
8. Build RESTful API endpoints for modulement server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

### Backend

```bash
cd backend
mvn clean install      # Install dependencies
mvn spring-boot:run    # Start development server
mvn test              # Run tests
mvn package           # Build JAR file
```opment server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Next Steps

### Frontend
1. Create folder structure for:
   - `/src/components` - Reusable UI components
   - `/src/lib` - Utility functions and helpers
   - `/src/types` - TypeScript type definitions
   - `/src/hooks` - Custom React hooks
   - `/src/app/api` - API routes (if needed)

2. Set up pages structure:
   - Authentication pages (login, register)
   - Dashboard layouts
   - Module-specific pages (Finance, Inventory, HR, Sales)

### Backend
1. Initialize Spring Boot project
2. Set up PostgreSQL connection with Supabase
3. Configure Spring Security
4. Create base entity models
5. Set up RESTful API endpoints

### Database
1. Design database schema
2. Create Supabase project
3. Set up database migrations
4. Configure connection strings

## 🔐 Environment Variables

Create `.env.local` files in respective directories:

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (`backend/application.properties`)
```
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
```

## 📚 Documentation

Documentation files are located in the `/docs` folder.

## 🤝 Contributing

This is an enterprise project. Follow the branching strategy:
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

## 📄 License

Private enterprise project.
