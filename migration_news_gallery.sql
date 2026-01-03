-- Migration pour ajouter les tables Actualités et Galerie

-- Table des actualités (News)
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  excerpt TEXT NOT NULL,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table de la galerie (Gallery)
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Activation de RLS (facultatif si vous gérez via l'authentification Express)
-- ALTER TABLE news ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
