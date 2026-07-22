BEGIN;

ALTER TABLE "ComisionAsignatura"
    ADD COLUMN IF NOT EXISTS modalidadesid integer;

-- Modalidades disponibles para las comisiones.
INSERT INTO "Modalidades" (
    descripcion,
    "usuarioAccion",
    "tsCreacion",
    "tsModificacion"
)
SELECT
    nueva.descripcion,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    VALUES
        ('Presencial'),
        ('Virtual'),
        ('Hibrida')
) AS nueva(descripcion)
WHERE NOT EXISTS (
    SELECT 1
    FROM "Modalidades" existente
    WHERE lower(trim(existente.descripcion)) = lower(trim(nueva.descripcion))
);

-- Relaciona los registros existentes con una de las modalidades permitidas.
UPDATE "ComisionAsignatura" ca
SET modalidadesid = (
    SELECT MIN(m.modalidadesid)
    FROM "Modalidades" m
    WHERE lower(trim(m.descripcion)) = lower(trim(ca.modalidad))
)
WHERE ca.modalidadesid IS NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "ComisionAsignatura"
        WHERE modalidadesid IS NULL
    ) THEN
        RAISE EXCEPTION
            'Existen comisiones con modalidades distintas de Presencial, Virtual o Hibrida';
    END IF;
END
$$;

-- Mantiene el texto anterior sincronizado con la modalidad relacionada.
UPDATE "ComisionAsignatura" ca
SET modalidad = m.descripcion
FROM "Modalidades" m
WHERE ca.modalidadesid = m.modalidadesid;

ALTER TABLE "ComisionAsignatura"
    ALTER COLUMN modalidadesid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ComisionAsignatura_modalidadesid_fkey'
    ) THEN
        ALTER TABLE "ComisionAsignatura"
            ADD CONSTRAINT "ComisionAsignatura_modalidadesid_fkey"
            FOREIGN KEY (modalidadesid)
            REFERENCES "Modalidades"(modalidadesid);
    END IF;
END
$$;

COMMIT;
