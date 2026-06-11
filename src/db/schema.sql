-- SokoYetu Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (retailers + manufacturers)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('retailer', 'manufacturer')) NOT NULL,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers (linked to manufacturer users)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  location VARCHAR(100) DEFAULT 'Kigali',
  description TEXT,
  emoji VARCHAR(10) DEFAULT '🏭',
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  established INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products listed by suppliers
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) DEFAULT '📦',
  price_rwf INTEGER NOT NULL,
  unit VARCHAR(50),
  moq INTEGER NOT NULL DEFAULT 1,
  stock INTEGER DEFAULT 0,
  category VARCHAR(50),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders placed by retailers
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 1500,
  total_rwf INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_transit','delivered','cancelled')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  delivery_location VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed data — sample suppliers
INSERT INTO suppliers (name, category, location, description, emoji, verified, rating, reviews_count, established)
VALUES
  ('Inyange Industries', 'Food & beverage', 'Kigali', 'Rwanda leading dairy and beverage manufacturer producing fresh milk, juices, and yogurt daily since 1997.', '🧴', true, 4.8, 124, 1997),
  ('Minimex Ltd', 'Food & beverage', 'Kigali', 'Premier flour and maize products manufacturer supplying quality staple foods to retailers across Rwanda.', '🌾', true, 4.6, 89, 2003),
  ('Sulfo Rwanda', 'Cleaning', 'Kigali', 'Manufacturer of soaps, detergents, and cosmetic products for homes and businesses.', '🧼', false, 4.2, 31, 2018),
  ('Rwanda Textiles', 'Textiles', 'Kigali', 'Quality fabric and textile goods produced locally with a focus on durability and affordability.', '🧵', true, 4.5, 57, 2010);
