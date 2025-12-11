# 🍳 SmartRecipes - Microservices Recipe Management Platform

A modern, scalable recipe management application built with **Spring Boot microservices architecture** and a React frontend. This project demonstrates enterprise-level microservices patterns including service discovery, API gateway, and distributed data management.


## 🏗️ Architecture Overview

SmartRecipes implements a microservices architecture with the following components:

### System Architecture
<img width="500" height="1000" alt="0e5f799e-e733-46f5-a730-3f18a31e1064" src="https://github.com/user-attachments/assets/a1ba2904-4297-4665-9b75-e94dc6a53db6" />

## 🔧 Microservices

### 1. **Discovery Service** (Eureka Server)
- **Port:** `8761`
- **Purpose:** Service registry and discovery
- **Technology:** Spring Cloud Netflix Eureka
- **URL:** `http://localhost:8761`

**Features:**
- Central service registry
- Health monitoring
- Load balancing support
- Service instance management

---

### 2. **Config Service**
- **Port:** `8888`
- **Purpose:** Centralized configuration management
- **Technology:** Spring Cloud Config Server

**Features:**
- External configuration management
- Environment-specific configurations
- Dynamic configuration updates

---

### 3. **Gateway Service**
- **Port:** `9999`
- **Purpose:** API Gateway and routing
- **Technology:** Spring Cloud Gateway
- **URL:** `http://localhost:9999`

**Features:**
- Unified entry point for all microservices
- Request routing and filtering
- Load balancing
- Cross-cutting concerns (CORS, authentication)

**Routing:**
- `/api/users/**` → User Service
- `/api/recipes/**` → Recipe Service
- `/api/ratings/**` → Rating Service

---

### 4. **User Service**
- **Port:** `8081`
- **Purpose:** User management and authentication
- **Database:** `userdb` (MySQL)
- **URL:** `http://localhost:9999/api/users`

**Endpoints:**
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User authentication
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user profile

**Entity Model:**
\`\`\`java
User {
  Long id
  String username
  String email
  String password
  LocalDateTime createdAt
}
\`\`\`

---

### 5. **Recipe Service**
- **Port:** `8082`
- **Purpose:** Recipe CRUD operations
- **Database:** `recipedb` (MySQL)
- **URL:** `http://localhost:9999/api/recipes`

**Endpoints:**
- `GET /api/recipes` - List all recipes
- `GET /api/recipes/{id}` - Get recipe details
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `GET /api/recipes/user/{userId}` - Get user's recipes

**Entity Model:**
\`\`\`java
Recipe {
  Long id
  String title
  String description
  String ingredients
  String steps
  String category
  Long userId
  LocalDateTime createdAt
}
\`\`\`

---

### 6. **Rating Service**
- **Port:** `8083`
- **Purpose:** Recipe rating and review system
- **Database:** `ratingdb` (MySQL)
- **URL:** `http://localhost:9999/api/ratings`

**Endpoints:**
- `POST /api/ratings` - Add rating to recipe
- `GET /api/ratings/recipe/{recipeId}` - Get recipe ratings
- `GET /api/ratings/user/{userId}` - Get user's ratings
- `GET /api/ratings/average/{recipeId}` - Get average rating

**Entity Model:**
\`\`\`java
Rating {
  Long id
  Long recipeId
  Long userId
  Integer rating (1-5)
  String comment
  LocalDateTime createdAt
}
\`\`\`

## 💻 Technologies

### Backend (Primary Focus)
- **Java 17** - Core language
- **Spring Boot 3.x** - Application framework
- **Spring Cloud** - Microservices infrastructure
  - Spring Cloud Netflix Eureka - Service discovery
  - Spring Cloud Gateway - API Gateway
  - Spring Cloud Config - Configuration management
- **H2** - Database (3 separate databases)
- **Maven** - Build tool
- **Lombok** - Boilerplate code reduction
- **JPA/Hibernate** - ORM

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- MySQL Server 8.0+
- Node.js 18+ (for frontend)
- Maven 3.6+


Update database credentials in each service's `application.yml`:

### Running the Services

**Start services in this order:**

1. **Config Service** (Optional)
\`\`\`bash
cd config-service
mvn spring-boot:run
\`\`\`

2. **Discovery Service** (Eureka)
\`\`\`bash
cd discovery-service
mvn spring-boot:run
 Access at http://localhost:8761
\`\`\`

3. **Gateway Service**
\`\`\`bash
cd gateway-service
mvn spring-boot:run
 API available at http://localhost:9999
\`\`\`

4. **Business Services** (parallel)
\`\`\`bash
\`\`\`

5. **Frontend** 
\`\`\`bash
npm install
npm run dev
# Access at http://localhost:3000
\`\`\`

### Verify Services

Check Eureka Dashboard to see all registered services:
http://localhost:8761

<img width="1900" height="777" alt="image" src="https://github.com/user-attachments/assets/0124683c-afb6-429d-a762-094b04246010" />


## 📸 Screenshots
### Login and Register
<img width="1919" height="778" alt="image" src="https://github.com/user-attachments/assets/c5313fed-afdb-4cdd-bf18-a5798f1e33b4" />
<img width="1902" height="821" alt="image" src="https://github.com/user-attachments/assets/6e1d22b6-7f66-445b-b590-5a497060efe4" />



### Dashboard
<img width="1891" height="846" alt="image" src="https://github.com/user-attachments/assets/121b8676-ea45-4eaa-8f94-99d164e0d631" />



### Recipe Detail
<img width="1919" height="854" alt="image" src="https://github.com/user-attachments/assets/f067175d-bd35-417c-9bca-ea338d2375cd" />

<img width="1919" height="850" alt="image" src="https://github.com/user-attachments/assets/32785e7c-e329-457d-94f9-e5121944c3b2" />


### Create Recipe
<img width="1919" height="743" alt="image" src="https://github.com/user-attachments/assets/032d0cb7-d34c-4aae-9611-fbcf7a3c5dc0" />

### User Profile
<img width="1919" height="817" alt="image" src="https://github.com/user-attachments/assets/a509fc48-cd12-400b-ad54-090aea4678ea" />



## 🔍 Key Features

### Microservices Patterns Implemented
- ✅ **Service Discovery** - Eureka for dynamic service registration
- ✅ **API Gateway** - Single entry point with routing
- ✅ **Database per Service** - Each microservice has its own database
- ✅ **RESTful APIs** - Standard HTTP methods for CRUD operations
- ✅ **Distributed Data Management** - Independent data stores
- ✅ **Health Monitoring** - Service health checks via Eureka

### Application Features
- 🔐 User registration and authentication
- 📝 Full CRUD operations for recipes
- ⭐ 5-star rating system with comments
- 👤 User profile management
- 📊 Average rating calculations
- 🎨 Modern, responsive UI
- 🍽️ Recipe categorization (Breakfast, Lunch, Dinner, etc.)

## 🛠️ Development

### Project Structure
<img width="538" height="239" alt="image" src="https://github.com/user-attachments/assets/a9dfde8b-12c0-4bd2-bf0b-be3bc8c226a4" />
<img width="555" height="443" alt="image" src="https://github.com/user-attachments/assets/49943319-879e-4bfb-b500-7c4ffee2308c" />


## 📝 Configuration

Each microservice registers with Eureka and can be accessed through the Gateway on port **9999**.

**Service Ports:**
| Service | Port | Access Via Gateway |
|---------|------|-------------------|
| Discovery (Eureka) | 8761 | Direct only |
| Config Server | 8888 | Direct only |
| Gateway | 9999 | Main entry point |
| User Service | 8081 | `/api/users/**` |
| Recipe Service | 8082 | `/api/recipes/**` |
| Rating Service | 8083 | `/api/ratings/**` |

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👥 Author

- Amine ELFALKI - [GitHub Profile](https://github.com/aminexi)



**⭐ If you found this project helpful, please give it a star!**
