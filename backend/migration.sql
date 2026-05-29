-- Adds image_url and brand fields to the products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255);
