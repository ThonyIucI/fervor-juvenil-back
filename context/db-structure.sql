-- ============================================================================
-- DATABASE SCHEMA REFERENCE
-- ============================================================================
-- This file serves as the source of truth for the database structure.
-- Update this file whenever migrations are created or database schema changes.
-- Last updated: 2025-10-25
-- ============================================================================

-- Enable UUID extension (required for PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Description: Core user authentication and basic information
-- Primary key: uuid (UUID v7, generated from backend)
-- ============================================================================
CREATE TABLE users (
    uuid UUID PRIMARY KEY,  -- UUID v7 generated from backend, NOT database
    slug VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL,
    dni VARCHAR(20),  -- National ID document
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_google_account BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_dni ON users(dni) WHERE dni IS NOT NULL;

-- ============================================================================
-- TABLE: roles
-- ============================================================================
-- Description: Role definitions (superadmin, admin, user, etc.)
-- Primary key: uuid (UUID v7, generated from backend)
-- ============================================================================
CREATE TABLE roles (
    uuid UUID PRIMARY KEY,  -- UUID v7 generated from backend
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX idx_roles_name ON roles(name);

-- ============================================================================
-- TABLE: user_roles
-- ============================================================================
-- Description: N:M relationship between users and roles
-- Primary key: uuid (UUID v7, generated from backend)
-- ============================================================================
CREATE TABLE user_roles (
    uuid UUID PRIMARY KEY,  -- UUID v7 generated from backend
    user_uuid UUID NOT NULL,
    role_uuid UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    -- Foreign keys
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_uuid)
        REFERENCES users(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_uuid)
        REFERENCES roles(uuid) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_user_roles_user_uuid ON user_roles(user_uuid);
CREATE INDEX idx_user_roles_role_uuid ON user_roles(role_uuid);
CREATE UNIQUE INDEX idx_user_roles_unique ON user_roles(user_uuid, role_uuid);

-- ============================================================================
-- TABLE: user_profiles
-- ============================================================================
-- Description: Detailed user profile information (dancers/group members)
-- Relationship: 1:1 with users
-- Primary key: uuid (UUID v7, generated from backend)
-- ============================================================================
CREATE TABLE user_profiles (
    uuid UUID PRIMARY KEY,  -- UUID v7 generated from backend
    user_uuid UUID NOT NULL UNIQUE,  -- 1:1 relationship with users
    registration_date TIMESTAMP,
    last_names VARCHAR(120),
    first_names VARCHAR(120),
    gender VARCHAR(10),
    age SMALLINT,
    birth_date DATE,
    status VARCHAR(10),  -- Status or membership code
    alias VARCHAR(80),  -- Nickname or group name
    has_uniform BOOLEAN,  -- Has group uniform/shirt
    shirt_size VARCHAR(5),
    pants_size VARCHAR(5),
    shoe_size VARCHAR(5),
    height_meters DECIMAL(4,2),
    weight_kg DECIMAL(5,2),
    health_insurance VARCHAR(50),
    blood_type VARCHAR(5),
    allergies TEXT,
    disability_or_disorder TEXT,
    enrollment_date DATE,
    current_residence VARCHAR(120),
    professional_goal VARCHAR(120),
    favorite_hero VARCHAR(120),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    -- Foreign keys
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_uuid)
        REFERENCES users(uuid) ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX idx_user_profiles_user_uuid ON user_profiles(user_uuid);
CREATE INDEX idx_user_profiles_enrollment_date ON user_profiles(enrollment_date);

-- ============================================================================
-- TABLE: guardians
-- ============================================================================
-- Description: Guardian/contact information for users
-- Relationship: 1:N with users (one user can have multiple guardians)
-- Primary key: uuid (UUID v7, generated from backend)
-- ============================================================================
CREATE TABLE guardians (
    uuid UUID PRIMARY KEY,  -- UUID v7 generated from backend
    user_uuid UUID NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(120),
    contact_type VARCHAR(50),  -- Type: Parent, Guardian, Emergency contact, etc.
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    -- Foreign keys
    CONSTRAINT fk_guardians_user FOREIGN KEY (user_uuid)
        REFERENCES users(uuid) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_guardians_user_uuid ON guardians(user_uuid);
CREATE INDEX idx_guardians_email ON guardians(email) WHERE email IS NOT NULL;

-- ============================================================================
-- RELATIONSHIPS SUMMARY
-- ============================================================================
-- users (1) ←→ (1) user_profiles
-- users (1) ←→ (N) guardians
-- users (N) ←→ (M) roles (through user_roles)

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- 1. ALL primary keys are UUID v7, generated from backend application
-- 2. NO database-level UUID generation (no uuid_generate_v4() defaults)
-- 3. ALL column names in English, using snake_case in database
-- 4. TypeORM schemas use camelCase, converted by SnakeNamingStrategy
-- 5. Foreign keys use CASCADE on delete for data consistency
-- 6. All timestamps managed by PostgreSQL DEFAULT now()
