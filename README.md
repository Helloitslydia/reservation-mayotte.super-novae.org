# Réservation de Transport - Projet Mayotte

Application web de gestion des réservations de transport pour le projet Mayotte de Super-Novae.

## Stack Technique

- **Frontend**
  - React 18 avec TypeScript
  - Tailwind CSS pour le style
  - Lucide React pour les icônes
  - Vite comme bundler

- **Backend**
  - Supabase pour la base de données PostgreSQL
  - Authentification intégrée
  - Stockage des fichiers
  - Row Level Security (RLS)

## Fonctionnalités Implémentées

### Système de Réservation
- Formulaire multi-étapes pour la réservation de transport
- Gestion de plusieurs trajets par réservation
- Upload sécurisé des documents d'identité
- Validation des données en temps réel

### Gestion des Profils
- Informations personnelles complètes
- Contact d'urgence
- Groupe sanguin
- Stockage sécurisé des documents d'identité

### Interface d'Administration
- Tableau de bord pour les administrateurs
- Gestion des statuts des réservations
- Visualisation détaillée des réservations
- Accès aux documents d'identité

### Sécurité
- Authentification des utilisateurs
- Protection des données personnelles
- Stockage sécurisé des fichiers
- Politiques d'accès granulaires

## User Stories

### En tant que Voyageur
- Je peux créer une réservation de transport
- Je peux ajouter plusieurs trajets à ma réservation
- Je peux fournir mes informations personnelles et documents
- Je reçois une confirmation de ma réservation

### En tant qu'Administrateur
- Je peux me connecter à l'interface d'administration
- Je peux voir toutes les réservations
- Je peux modifier le statut des réservations
- Je peux consulter les détails complets des voyageurs
- Je peux accéder aux documents d'identité
- Je peux gérer plusieurs réservations simultanément

### En tant que Responsable Logistique
- Je peux suivre les demandes de transport en temps réel
- Je peux organiser les trajets efficacement
- Je peux accéder à toutes les informations nécessaires
- Je peux communiquer le statut des réservations

## Installation et Déploiement

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement
4. Lancer en développement : `npm run dev`
5. Build pour production : `npm run build`

## Sécurité et Confidentialité

- Toutes les données personnelles sont protégées
- Les documents d'identité sont stockés de manière sécurisée
- L'accès aux données est strictement contrôlé
- Les politiques RLS assurent la séparation des données