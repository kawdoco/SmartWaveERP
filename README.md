# SmartWave ERP - Enterprise Resource Planning System

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend for the SmartWave ERP system.

```
SmartWaveERP/
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/      # App Router pages
│   ├── public/       # Static assets
│   └── package.json
├── backend/          # Spring Boot application (to be created)
└── docs/            # Documentation
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: React 19

### Backend (To be implemented)
- **Framework**: Java Spring Boot
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Spring Security

## 📦 Frontend Setup

The frontend has been initialized with Next.js. To get started:

```bash
cd frontend
npm install    # Already done
npm run dev    # Start development server
```

The application will be available at `http://localhost:3000`

## 🛠️ Available Scripts (Frontend)

- `npm run dev` - Start development server
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
