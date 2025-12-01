# SmartRecipes - Documentation Complète du Projet

## Table des Matières
1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture Microservices](#architecture-microservices)
3. [Services Infrastructure](#services-infrastructure)
4. [Services Métier](#services-métier)
5. [Application React Frontend](#application-react-frontend)
6. [Base de Données](#base-de-données)
7. [Guide de Déploiement](#guide-de-déploiement)

---

## Vue d'ensemble du projet

**SmartRecipes** est une application web complète de gestion de recettes culinaires construite avec une architecture microservices. Le projet utilise Spring Boot pour le backend et React (Next.js) pour le frontend.

### Technologies Utilisées

**Backend:**
- Java 17+
- Spring Boot 3.x
- Spring Cloud (Netflix Eureka, Spring Cloud Gateway)
- Spring Data JPA
- H2 Database (développement)
- Maven

**Frontend:**
- React 19.2
- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

---

## Architecture Microservices

L'application suit une architecture microservices composée de 6 services distincts :

### Diagramme d'Architecture

\`\`\`
┌─────────────────┐
│   Frontend      │
│   Next.js       │
│   Port: 3000    │
└────────┬────────┘
│
▼
┌─────────────────────────────────────┐
│   Gateway Service                   │
│   Spring Cloud Gateway              │
│   Port: 9999                        │
│   - Routage des requêtes           │
│   - Load balancing                  │
└────────┬────────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│   Discovery Service (Eureka)        │
│   Port: 8761                        │
│   - Service Registry               │
│   - Service Discovery              │
└─────────────────────────────────────┘
│
┌────┴────┬────────┬──────────┐
▼         ▼        ▼          ▼
┌────────┐ ┌─────┐ ┌────────┐ ┌────────┐
│ User   │ │Recipe│ │Rating  │ │Config  │
│Service │ │Service│ │Service │ │Service │
│:9091   │ │:9092 │ │:9093   │ │:8888   │
└────────┘ └─────┘ └────────┘ └────────┘
\`\`\`

---

## Services Infrastructure

### 1. Service de Découverte (Discovery Service)

**Description:** Service Eureka Netflix qui agit comme un registre de services permettant la découverte automatique des microservices.

**Détails Techniques:**
- **Port:** 8761
- **URL:** `http://localhost:8761`
- **Nom du service:** `discovery-service`
- **Technologie:** Spring Cloud Netflix Eureka Server

**Fonctionnalités:**
- Enregistrement automatique des services
- Heartbeat et health checks
- Dashboard de visualisation des services
- Service registry centralisé

**Configuration:**
\`\`\`yaml
server:
port: 8761

eureka:
client:
register-with-eureka: false
fetch-registry: false
\`\`\`

**Interface Web:**
- Accessible via: `http://localhost:8761`
- Affiche tous les services enregistrés
- Statut en temps réel des services

---

### 2. Service de Configuration (Config Service)

**Description:** Service centralisé de gestion des configurations pour tous les microservices.

**Détails Techniques:**
- **Port:** 8888
- **URL:** `http://localhost:8888`
- **Nom du service:** `config-service`
- **Technologie:** Spring Cloud Config Server

**Fonctionnalités:**
- Configuration centralisée
- Gestion des profils (dev, prod, test)
- Rechargement dynamique des configurations
- Support Git pour le versioning

---

### 3. Service de Passerelle (Gateway Service)

**Description:** Point d'entrée unique pour toutes les requêtes API. Route les requêtes vers les microservices appropriés.

**Détails Techniques:**
- **Port:** 9999
- **URL:** `http://localhost:9999`
- **Nom du service:** `gateway-service`
- **Technologie:** Spring Cloud Gateway

**Routes Configurées:**

1. **User Service Routes:**
    - `http://localhost:9999/api/users/**` → User Service (9091)

2. **Recipe Service Routes:**
    - `http://localhost:9999/api/recipes/**` → Recipe Service (9092)

3. **Rating Service Routes:**
    - `http://localhost:9999/api/ratings/**` → Rating Service (9093)

**Fonctionnalités:**
- Load balancing automatique
- Routage intelligent
- Filtres pour authentification (future)
- Rate limiting (configurable)
- CORS configuration

**Configuration:**
\`\`\`yaml
server:
port: 9999

spring:
application:
name: gateway-service
cloud:
gateway:
routes:
- id: user-service
uri: lb://user-service
predicates:
- Path=/api/users/**
- id: recipe-service
uri: lb://recipe-service
predicates:
- Path=/api/recipes/**
- id: rating-service
uri: lb://rating-service
predicates:
- Path=/api/ratings/**
\`\`\`

---

## Services Métier

### 4. Service Utilisateur (User Service)

**Description:** Gère toutes les opérations liées aux utilisateurs (inscription, connexion, profil).

**Détails Techniques:**
- **Port:** 9091
- **URL directe:** `http://localhost:9091`
- **URL via Gateway:** `http://localhost:9999/api/users`
- **Nom du service:** `user-service`
- **Base de données:** H2 (en mémoire)

**Modèle de Données - Entité User:**
\`\`\`java
@Entity
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private String username;
private String email;
private String password;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
}
\`\`\`

**Endpoints API:**

1. **Créer un utilisateur (Inscription)**
    - **Méthode:** POST
    - **URL:** `/api/users`
    - **Body:**
      \`\`\`json
      {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securepass123"
      }
      \`\`\`
    - **Réponse:** 201 Created
      \`\`\`json
      {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
      }
      \`\`\`

2. **Connexion utilisateur**
    - **Méthode:** POST
    - **URL:** `/api/users/login`
    - **Body:**
      \`\`\`json
      {
      "email": "john@example.com",
      "password": "securepass123"
      }
      \`\`\`
    - **Réponse:** 200 OK avec données utilisateur

3. **Obtenir un utilisateur par ID**
    - **Méthode:** GET
    - **URL:** `/api/users/{id}`
    - **Réponse:** 200 OK avec données utilisateur

4. **Mettre à jour un utilisateur**
    - **Méthode:** PUT
    - **URL:** `/api/users/{id}`
    - **Body:** Données à modifier
    - **Réponse:** 200 OK avec données mises à jour

**Fonctionnalités:**
- Inscription de nouveaux utilisateurs
- Authentification (login)
- Gestion de profil
- Validation des emails
- Hashage des mots de passe

**Base de Données H2:**
- Console: `http://localhost:9091/h2-console`
- JDBC URL: `jdbc:h2:mem:userdb`
- Username: `sa`
- Password: (vide)

---

### 5. Service Recette (Recipe Service)

**Description:** Gère toutes les opérations CRUD sur les recettes culinaires.

**Détails Techniques:**
- **Port:** 9092
- **URL directe:** `http://localhost:9092`
- **URL via Gateway:** `http://localhost:9999/api/recipes`
- **Nom du service:** `recipe-service`
- **Base de données:** H2 (en mémoire)

**Modèle de Données - Entité Recipe:**
\`\`\`java
@Entity
public class Recipe {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private String name;

    @Column(length = 1000)
    private String description;
    
    @Column(length = 2000)
    private String ingredients;
    
    @Column(length = 3000)
    private String steps;
    
    private String category;
    private Long userId; // Créateur de la recette
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
\`\`\`

**Endpoints API:**

1. **Créer une recette**
    - **Méthode:** POST
    - **URL:** `/api/recipes`
    - **Body:**
      \`\`\`json
      {
      "name": "Pasta Carbonara",
      "description": "Plat italien classique",
      "ingredients": "Pâtes, œufs, bacon, parmesan",
      "steps": "1. Cuire les pâtes\n2. Préparer la sauce\n3. Mélanger",
      "category": "Lunch",
      "userId": 1
      }
      \`\`\`
    - **Réponse:** 201 Created

2. **Obtenir toutes les recettes**
    - **Méthode:** GET
    - **URL:** `/api/recipes`
    - **Réponse:** 200 OK avec liste de recettes

3. **Obtenir une recette par ID**
    - **Méthode:** GET
    - **URL:** `/api/recipes/{id}`
    - **Réponse:** 200 OK avec détails de la recette

4. **Obtenir les recettes d'un utilisateur**
    - **Méthode:** GET
    - **URL:** `/api/recipes/user/{userId}`
    - **Réponse:** 200 OK avec liste de recettes

5. **Mettre à jour une recette**
    - **Méthode:** PUT
    - **URL:** `/api/recipes/{id}`
    - **Body:** Données à modifier
    - **Réponse:** 200 OK

6. **Supprimer une recette**
    - **Méthode:** DELETE
    - **URL:** `/api/recipes/{id}`
    - **Réponse:** 204 No Content

**Catégories de Recettes:**
- Breakfast (Petit-déjeuner)
- Lunch (Déjeuner)
- Dinner (Dîner)
- Dessert
- Appetizer (Entrée)
- Snack (Collation)
- Beverage (Boisson)
- Salad (Salade)

**Base de Données H2:**
- Console: `http://localhost:9092/h2-console`
- JDBC URL: `jdbc:h2:mem:recipedb`
- Username: `sa`
- Password: (vide)

---

### 6. Service d'Évaluation (Rating Service)

**Description:** Gère les évaluations et commentaires des recettes.

**Détails Techniques:**
- **Port:** 9093
- **URL directe:** `http://localhost:9093`
- **URL via Gateway:** `http://localhost:9999/api/ratings`
- **Nom du service:** `rating-service`
- **Base de données:** H2 (en mémoire)

**Modèle de Données - Entité Rating:**
\`\`\`java
@Entity
public class Rating {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private Long recipeId;
private Long userId;
private Integer rating; // 1-5 étoiles
private String comment;
private LocalDateTime createdAt;
}
\`\`\`

**Endpoints API:**

1. **Créer une évaluation**
    - **Méthode:** POST
    - **URL:** `/api/ratings`
    - **Body:**
      \`\`\`json
      {
      "recipeId": 1,
      "userId": 2,
      "rating": 5,
      "comment": "Excellente recette!"
      }
      \`\`\`
    - **Réponse:** 201 Created

2. **Obtenir toutes les évaluations**
    - **Méthode:** GET
    - **URL:** `/api/ratings`
    - **Réponse:** 200 OK avec liste d'évaluations

3. **Obtenir les évaluations d'une recette**
    - **Méthode:** GET
    - **URL:** `/api/ratings/recipe/{recipeId}`
    - **Réponse:** 200 OK
      \`\`\`json
      {
      "recipeId": 1,
      "averageRating": 4.5,
      "totalRatings": 10,
      "ratings": [...]
      }
      \`\`\`

4. **Obtenir les évaluations d'un utilisateur**
    - **Méthode:** GET
    - **URL:** `/api/ratings/user/{userId}`
    - **Réponse:** 200 OK avec liste d'évaluations

5. **Supprimer une évaluation**
    - **Méthode:** DELETE
    - **URL:** `/api/ratings/{id}`
    - **Réponse:** 204 No Content

**Fonctionnalités:**
- Système de notation 1-5 étoiles
- Commentaires textuels
- Calcul de moyenne automatique
- Une évaluation par utilisateur par recette
- Historique des évaluations

**Base de Données H2:**
- Console: `http://localhost:9093/h2-console`
- JDBC URL: `jdbc:h2:mem:ratingdb`
- Username: `sa`
- Password: (vide)

---

## Application React Frontend

### Architecture Frontend

L'application frontend est construite avec **Next.js 16** utilisant le **App Router** et **React 19.2**.

**Structure du Projet:**
\`\`\`
smartrecipes2/
├── app/
│   ├── page.tsx           # Page principale (Dashboard)
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Styles globaux
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── recipes/
│   │   ├── recipe-list.tsx
│   │   ├── recipe-form.tsx
│   │   ├── recipe-detail.tsx
│   │   ├── rating-form.tsx
│   │   └── rating-list.tsx
│   └── user/
│       └── user-profile.tsx
└── lib/
└── seed-data.ts
\`\`\`

---

### Pages et Composants

#### 1. Page Principale (app/page.tsx)

**Description:** Point d'entrée de l'application, contient le tableau de bord principal avec navigation par onglets.

**Fonctionnalités:**
- Système de navigation à 3 onglets :
    - **Recipes** (Recettes) - Affichage de toutes les recettes
    - **Create** (Créer) - Formulaire de création de recette
    - **Profile** (Profil) - Gestion du profil utilisateur
- Gestion de l'état d'authentification
- Affichage conditionnel basé sur la connexion

**État Géré:**
\`\`\`typescript
- isLoggedIn: boolean          // État de connexion
- currentUser: User | null     // Utilisateur connecté
- activeTab: string            // Onglet actif
  \`\`\`

**Interface Utilisateur:**
- En-tête avec titre et bouton de déconnexion
- Navigation par onglets horizontale
- Gradient d'arrière-plan (orange → rose)
- Responsive design

---

#### 2. Formulaire de Connexion (components/auth/login-form.tsx)

**Description:** Permet aux utilisateurs de se connecter à l'application.

**Fonctionnalités:**
- Validation des champs email et mot de passe
- Gestion des erreurs de connexion
- États de chargement
- Notifications toast

**Champs du Formulaire:**
- Email (obligatoire)
- Mot de passe (obligatoire)

**API Appelée:**
\`\`\`typescript
POST http://localhost:9999/api/users/login
Body: { email, password }
\`\`\`

**Gestion d'État:**
- Stockage de l'utilisateur dans localStorage
- Mise à jour de l'état parent (isLoggedIn)

---

#### 3. Formulaire d'Inscription (components/auth/register-form.tsx)

**Description:** Permet la création de nouveaux comptes utilisateur.

**Fonctionnalités:**
- Validation des champs
- Vérification de la correspondance des mots de passe
- Validation de format d'email
- Connexion automatique après inscription

**Champs du Formulaire:**
- Nom d'utilisateur (obligatoire, min 3 caractères)
- Email (obligatoire, format email)
- Mot de passe (obligatoire, min 6 caractères)
- Confirmation mot de passe (doit correspondre)

**API Appelée:**
\`\`\`typescript
POST http://localhost:9999/api/users
Body: { username, email, password }
\`\`\`

**Validation:**
- Email unique
- Nom d'utilisateur unique
- Force du mot de passe

---

#### 4. Liste des Recettes (components/recipes/recipe-list.tsx)

**Description:** Affiche toutes les recettes disponibles sous forme de grille de cartes.

**Fonctionnalités:**
- Grille responsive (3 colonnes sur grand écran)
- Affichage de la note moyenne avec étoiles
- Boutons d'édition/suppression (propriétaire uniquement)
- Chargement des évaluations pour chaque recette
- Modal de détails de recette

**Données Affichées par Carte:**
- Nom de la recette
- Description (tronquée)
- Catégorie avec badge coloré
- Note moyenne (⭐ X.X)
- Nombre d'évaluations
- Boutons d'action (si propriétaire)

**APIs Appelées:**
\`\`\`typescript
GET http://localhost:9999/api/recipes           // Toutes les recettes
GET http://localhost:9999/api/ratings/recipe/{id} // Notes par recette
DELETE http://localhost:9999/api/recipes/{id}   // Suppression
\`\`\`

**Design:**
- Cartes avec fond blanc et ombre
- Gradient subtil d'arrière-plan
- Badges de catégorie colorés
- Hover effects

---

#### 5. Formulaire de Recette (components/recipes/recipe-form.tsx)

**Description:** Formulaire de création et modification de recettes.

**Fonctionnalités:**
- Mode création et édition
- Validation de tous les champs
- Sélection de catégorie par dropdown
- Textarea pour descriptions longues
- Réinitialisation après création

**Champs du Formulaire:**
- Nom (obligatoire)
- Description (obligatoire)
- Ingrédients (obligatoire, format multiligne)
- Étapes de préparation (obligatoire, format multiligne)
- Catégorie (sélection obligatoire)

**Catégories Disponibles:**
\`\`\`typescript
const categories = [
"Breakfast", "Lunch", "Dinner", "Dessert",
"Appetizer", "Snack", "Beverage", "Salad"
]
\`\`\`

**APIs Appelées:**
\`\`\`typescript
POST http://localhost:9999/api/recipes    // Création
PUT http://localhost:9999/api/recipes/{id} // Modification
\`\`\`

**Validation:**
- Tous les champs sont obligatoires
- Description min 10 caractères
- Ingrédients et étapes non vides

---

#### 6. Détails de Recette (components/recipes/recipe-detail.tsx)

**Description:** Modal affichant les détails complets d'une recette avec son système d'évaluation.

**Fonctionnalités:**
- Affichage complet de la recette
- Section d'ingrédients formatée
- Étapes numérotées de préparation
- Formulaire d'évaluation intégré
- Liste des évaluations existantes
- Note moyenne en temps réel

**Sections Affichées:**
1. **En-tête:**
    - Nom de la recette
    - Catégorie
    - Note moyenne

2. **Description:**
    - Texte complet de description

3. **Ingrédients:**
    - Liste à puces formatée
    - Séparation par lignes

4. **Étapes de Préparation:**
    - Numérotation automatique
    - Instructions détaillées

5. **Évaluations:**
    - Formulaire d'ajout (si connecté)
    - Liste des évaluations existantes
    - Note moyenne calculée

**APIs Appelées:**
\`\`\`typescript
GET http://localhost:9999/api/ratings/recipe/{id}
\`\`\`

---

#### 7. Formulaire d'Évaluation (components/recipes/rating-form.tsx)

**Description:** Permet aux utilisateurs d'évaluer une recette (1-5 étoiles + commentaire).

**Fonctionnalités:**
- Sélection d'étoiles interactive
- Commentaire optionnel
- Vérification : une évaluation par utilisateur
- Mise à jour automatique de la liste après soumission
- Prevention des évaluations multiples

**Champs:**
- Note (1-5 étoiles, obligatoire)
- Commentaire (optionnel, max 500 caractères)

**API Appelée:**
\`\`\`typescript
POST http://localhost:9999/api/ratings
Body: {
recipeId,
userId,
rating,
comment
}
\`\`\`

**Logique de Vérification:**
\`\`\`typescript
// Vérifie si l'utilisateur a déjà évalué
const hasRated = existingRatings.some(r => r.userId === currentUser.id)
\`\`\`

**État Local:**
- Stockage dans localStorage des évaluations soumises
- Persistance après rechargement de page

---

#### 8. Liste des Évaluations (components/recipes/rating-list.tsx)

**Description:** Affiche toutes les évaluations d'une recette avec calcul de moyenne.

**Fonctionnalités:**
- Calcul automatique de la note moyenne
- Affichage du nombre total d'évaluations
- Liste détaillée de chaque évaluation
- Étoiles visuelles pour chaque note
- Gestion des dates de création

**Données Affichées:**
1. **Résumé:**
    - Note moyenne (X.X/5)
    - Nombre total d'évaluations
    - Étoiles visuelles

2. **Liste des Évaluations:**
    - Nom d'utilisateur (ou "Anonyme")
    - Note en étoiles
    - Commentaire
    - Date relative (ex: "il y a 2 jours")

**Calcul de Moyenne:**
\`\`\`typescript
const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
\`\`\`

**Formatage de Date:**
- Conversion en format relatif
- Gestion des dates invalides
- Fallback: "Recently"

---

#### 9. Profil Utilisateur (components/user/user-profile.tsx)

**Description:** Permet aux utilisateurs de voir et modifier leurs informations personnelles.

**Fonctionnalités:**
- Affichage des informations actuelles
- Modification du nom d'utilisateur
- Modification de l'email
- Changement de mot de passe
- Validation des modifications

**Champs Modifiables:**
- Nom d'utilisateur
- Email
- Nouveau mot de passe (optionnel)

**API Appelée:**
\`\`\`typescript
PUT http://localhost:9999/api/users/{id}
Body: { username, email, password }
\`\`\`

**Validation:**
- Email format valide
- Nom d'utilisateur min 3 caractères
- Mot de passe min 6 caractères (si fourni)

**Mise à Jour:**
- Mise à jour du localStorage
- Rafraîchissement de l'état global
- Notification de succès

---

### Gestion d'État et Données

#### LocalStorage

L'application utilise le localStorage du navigateur pour la persistance :

\`\`\`typescript
// Stockage de l'utilisateur connecté
localStorage.setItem('currentUser', JSON.stringify(user))

// Stockage des évaluations soumises
localStorage.setItem('submittedRatings', JSON.stringify(ratings))
\`\`\`

**Données Stockées:**
- `currentUser`: Informations de l'utilisateur connecté
- `submittedRatings`: Map des évaluations soumises par recette

#### Communication avec l'API

Toutes les requêtes passent par le **Gateway Service** sur le port **9999**.

**Configuration de Base:**
\`\`\`typescript
const API_BASE_URL = 'http://localhost:9999/api'
\`\`\`

**Headers Standard:**
\`\`\`typescript
headers: {
'Content-Type': 'application/json'
}
\`\`\`

**Gestion des Erreurs:**
- Try-catch sur toutes les requêtes
- Messages d'erreur via toast notifications
- Logs console pour debugging

---

### Design System

#### Palette de Couleurs

**Couleurs Principales:**
- Primary: Orange (`#f97316`)
- Background: Blanc (`#ffffff`)
- Foreground: Gris foncé (`#09090b`)

**Gradients:**
- Dashboard: `from-orange-50 via-rose-50 to-orange-50`
- Cartes: Fond blanc avec ombre subtile

#### Typographie

**Polices:**
- Sans-serif: Geist
- Monospace: Geist Mono

**Hiérarchie:**
- H1: `text-4xl font-bold`
- H2: `text-3xl font-bold`
- H3: `text-2xl font-semibold`
- Body: `text-base`

#### Composants UI

Utilisation de **shadcn/ui** pour les composants :
- Button
- Card
- Input
- Textarea
- Select
- Tabs
- Dialog
- Toast

---

### Flux Utilisateur

#### 1. Inscription et Connexion

\`\`\`
Utilisateur arrive → Page d'accueil
↓
Clic sur "Register" → Formulaire d'inscription
↓
Remplit le formulaire → Validation
↓
Soumission → API User Service
↓
Succès → Connexion automatique → Dashboard
\`\`\`

#### 2. Création de Recette

\`\`\`
Utilisateur connecté → Dashboard
↓
Clic onglet "Create" → Formulaire de création
↓
Remplit tous les champs → Validation
↓
Sélection catégorie → Soumission
↓
API Recipe Service → Succès
↓
Retour onglet "Recipes" → Nouvelle recette visible
\`\`\`

#### 3. Évaluation d'une Recette

\`\`\`
Dashboard → Liste de recettes
↓
Clic sur une recette → Modal détails
↓
Scroll vers formulaire d'évaluation
↓
Sélection étoiles + Commentaire → Soumission
↓
Vérification (pas déjà évalué) → API Rating Service
↓
Succès → Rafraîchissement liste → Note moyenne mise à jour
\`\`\`

#### 4. Modification de Profil

\`\`\`
Dashboard → Onglet "Profile"
↓
Affichage infos actuelles
↓
Modification champs → Validation
↓
Soumission → API User Service
↓
Succès → Mise à jour localStorage → Notification
\`\`\`

---

## Base de Données

### Schéma de Base de Données

Chaque service utilise sa propre base de données H2 (isolation des données).

#### Table USERS (User Service)

\`\`\`sql
CREATE TABLE users (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Table RECIPES (Recipe Service)

\`\`\`sql
CREATE TABLE recipes (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description VARCHAR(1000),
ingredients VARCHAR(2000),
steps VARCHAR(3000),
category VARCHAR(50),
user_id BIGINT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Table RATINGS (Rating Service)

\`\`\`sql
CREATE TABLE ratings (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
recipe_id BIGINT NOT NULL,
user_id BIGINT NOT NULL,
rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
comment VARCHAR(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(recipe_id, user_id)
);
\`\`\`

### Relations entre Services

Les services communiquent via des **IDs** :

\`\`\`
User (id=1)
↓ userId
Recipe (id=1, userId=1)
↓ recipeId
Rating (id=1, recipeId=1, userId=2)
\`\`\`

**Note:** Il n'y a pas de clés étrangères entre services (architecture microservices).

---

## Guide de Déploiement

### Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- Node.js 18+ et npm/yarn
- Git

### Étapes de Déploiement Backend

#### 1. Cloner le Projet

\`\`\`bash
git clone <repository-url>
cd smartrecipes2
\`\`\`

#### 2. Compiler les Services

\`\`\`bash
# Compiler tous les services
mvn clean install -DskipTests
\`\`\`

#### 3. Démarrer les Services (Ordre Important)

**Ordre de démarrage:**

1. **Config Service** (Port 8888)
   \`\`\`bash
   cd config-service
   mvn spring-boot:run
   \`\`\`

2. **Discovery Service** (Port 8761)
   \`\`\`bash
   cd discovery-service
   mvn spring-boot:run
   \`\`\`

3. **Services Métier** (Ports 9091-9093)
   \`\`\`bash
# Terminal 1
cd user-service
mvn spring-boot:run

# Terminal 2
cd recipe-service
mvn spring-boot:run

# Terminal 3
cd rating-service
mvn spring-boot:run
\`\`\`

4. **Gateway Service** (Port 9999)
   \`\`\`bash
   cd gateway-service
   mvn spring-boot:run
   \`\`\`

#### 4. Vérification

- Eureka Dashboard: `http://localhost:8761`
- Vérifier que tous les services sont enregistrés

### Étapes de Déploiement Frontend

#### 1. Installer les Dépendances

\`\`\`bash
npm install
# ou
yarn install
\`\`\`

#### 2. Lancer le Serveur de Développement

\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

#### 3. Accéder à l'Application

- Frontend: `http://localhost:3000`

### Build de Production

#### Backend

\`\`\`bash
# Build de tous les services
mvn clean package -DskipTests

# Générer les JARs
# Les fichiers .jar seront dans target/ de chaque service
\`\`\`

#### Frontend

\`\`\`bash
npm run build
npm start
\`\`\`

### Variables d'Environnement

#### Backend

Configurer dans `application.yml` de chaque service :

\`\`\`yaml
spring:
application:
name: <service-name>
eureka:
client:
service-url:
defaultZone: http://localhost:8761/eureka/
\`\`\`

#### Frontend

Créer un fichier `.env.local` :

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:9999/api
\`\`\`

---

## Tests et Debugging

### Tests des Services

\`\`\`bash
# Tests unitaires
cd <service-folder>
mvn test

# Tests d'intégration
mvn verify
\`\`\`

### Debugging Frontend

Les composants utilisent `console.log("[v0] ...")` pour le debugging :

\`\`\`typescript
console.log("[v0] Recipes fetched:", recipes)
console.log("[v0] API call failed:", error)
\`\`\`

Ouvrir les DevTools du navigateur (F12) pour voir les logs.

### Endpoints de Health Check

Chaque service expose un endpoint de santé :

\`\`\`
GET http://localhost:9091/actuator/health  # User Service
GET http://localhost:9092/actuator/health  # Recipe Service
GET http://localhost:9093/actuator/health  # Rating Service
\`\`\`

---

## Résumé des Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Config Service | 8888 | http://localhost:8888 |
| Discovery Service (Eureka) | 8761 | http://localhost:8761 |
| User Service | 9091 | http://localhost:9091 |
| Recipe Service | 9092 | http://localhost:9092 |
| Rating Service | 9093 | http://localhost:9093 |
| Gateway Service | 9999 | http://localhost:9999 |

---

## Fonctionnalités de l'Application

### Fonctionnalités Implémentées

✅ Inscription et connexion utilisateur  
✅ Création de recettes avec catégories  
✅ Modification de recettes (propriétaire uniquement)  
✅ Suppression de recettes (propriétaire uniquement)  
✅ Système de notation 1-5 étoiles  
✅ Commentaires sur les recettes  
✅ Calcul automatique de note moyenne  
✅ Une évaluation par utilisateur par recette  
✅ Gestion de profil utilisateur  
✅ Interface responsive  
✅ Notifications toast  
✅ Persistance locale (localStorage)

### Améliorations Futures

🔲 Authentification JWT  
🔲 Upload d'images de recettes  
🔲 Recherche et filtrage de recettes  
🔲 Recettes favorites  
🔲 Partage sur réseaux sociaux  
🔲 Base de données PostgreSQL (production)  
🔲 Pagination des recettes  
🔲 Modération des commentaires  
🔲 Notifications en temps réel  
🔲 Tests automatisés (Jest, JUnit)

---

## Contact et Support

Pour toute question ou problème :
1. Vérifier les logs de la console
2. Vérifier le dashboard Eureka
3. Tester les endpoints avec Postman
4. Consulter les bases de données H2

