create TABLE "List of medicines" (
    id SERIAL PRIMARY KEY,
    "Anatomical, therapeutic and chemical classification (ATC)" VARCHAR (255),
    "Medicinal products" VARCHAR (2000),
    "Dosage forms" VARCHAR (2000),
    "ATC code" VARCHAR (255)
);
create TABLE "Drag info"(
    id SERIAL PRIMARY KEY,
    "Product name" VARCHAR (255),
    "Image of product" VARCHAR (2000),
    "symptoms" VARCHAR (2000),
    "Description" TEXT
);