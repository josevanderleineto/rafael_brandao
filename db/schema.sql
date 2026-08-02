CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT 'Sob consulta',
  "priceValue" INTEGER NOT NULL DEFAULT 0 CHECK ("priceValue" >= 0),
  badge TEXT NOT NULL CHECK (badge IN ('Venda', 'Aluguel', 'Lançamento')),
  type TEXT NOT NULL CHECK (type IN ('Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial')),
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  image TEXT NOT NULL,
  beds INTEGER NOT NULL DEFAULT 0 CHECK (beds >= 0),
  baths INTEGER NOT NULL DEFAULT 0 CHECK (baths >= 0),
  area INTEGER NOT NULL DEFAULT 0 CHECK (area >= 0),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';
CREATE INDEX IF NOT EXISTS properties_featured_id_idx ON properties (featured DESC, id DESC);
