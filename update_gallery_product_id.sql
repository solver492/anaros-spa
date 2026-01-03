-- Ajout de la colonne product_id à la table gallery
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);

-- Commentaire pour expliquer l'utilité
COMMENT ON COLUMN gallery.product_id IS 'ID du produit associé pour permettre la réservation directe depuis la galerie';
