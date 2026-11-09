-- RV FITNESS Database Schema for PostgreSQL
-- Database: rv_fitness_db (port 5433)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'admin', 'trainer', 'member'
    related_id VARCHAR(30), -- 'TR-001', 'RVF-0001', or NULL
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(50),
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active',
    assigned_trainer_id VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    trainer_id VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(100),
    experience VARCHAR(50),
    salary NUMERIC(10,2) DEFAULT 0,
    bio TEXT,
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membership_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member_memberships (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(30) NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(30) UNIQUE NOT NULL,
    member_id VARCHAR(30) NOT NULL,
    membership_id INT,
    amount NUMERIC(10,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(100),
    payment_status VARCHAR(30) DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    check_in_time VARCHAR(20),
    check_out_time VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member_daily_attendance UNIQUE(member_id, date)
);

CREATE TABLE IF NOT EXISTS workout_plans (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    member_id VARCHAR(30),
    trainer_id VARCHAR(30),
    goal VARCHAR(100),
    exercises TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diet_plans (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    member_id VARCHAR(30),
    calorie_target INT,
    meals TEXT,
    nutrition_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_records (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(30) NOT NULL,
    record_date DATE DEFAULT CURRENT_DATE,
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    chest NUMERIC(5,2),
    waist NUMERIC(5,2),
    arms NUMERIC(5,2),
    fitness_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    target_role VARCHAR(20) DEFAULT 'all', -- 'all', 'admin', 'trainer', 'member'
    target_id VARCHAR(30),
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gym_settings (
    id SERIAL PRIMARY KEY,
    gym_name VARCHAR(100) DEFAULT 'RV FITNESS',
    tagline VARCHAR(200) DEFAULT 'The Ultimate Fitness Hub',
    address TEXT DEFAULT 'Near Datta Mandir, Narsobawadi, Maharashtra 416104, India',
    phone VARCHAR(30) DEFAULT '+91 98765 43210',
    email VARCHAR(100) DEFAULT 'info@rvfitness.in',
    currency VARCHAR(10) DEFAULT '₹',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
