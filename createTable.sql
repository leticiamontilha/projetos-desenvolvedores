CREATE DATEBASE m4_entrega_s3;

CREATE TYPE OperationalSystem AS ENUM ('windows', 'linux', 'macOS');


CREATE TABLE IF NOT EXISTS developer_infos (
"id" SERIAL PRIMARY KEY,
"developerSince" DATE NOT NULL,
"preferredOS" OperationalSystem NOT NULL
);


CREATE TABLE IF NOT EXISTS developers (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(50) NOT NULL,
"email" VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE 
	developers
ADD COLUMN
	"developerInfoId" INTEGER UNIQUE;

ALTER TABLE 
developers
ADD FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id"); 

CREATE TABLE IF NOT EXISTS projects (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(50) NOT NULL,
"description" TEXT NOT NULL,
"estimatedTime" VARCHAR(20) NOT NULL,
"repository" VARCHAR(120) NOT NULL,
"startDate" DATE NOT NULL,
"endDate" DATE
);

ALTER TABLE 
	projects
ADD COLUMN
	"developerId" INTEGER NOT NULL;

ALTER TABLE 
projects
ADD FOREIGN KEY ("developerId") REFERENCES developers("id"); 

CREATE TABLE IF NOT EXISTS technologies (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(30) NOT NULL
);

INSERT INTO 
technologies("name")
VALUES
('JavaScript'), ('Python'), ('React'), ('Express.js'), ('HTML'), ('CSS'), ('Django'), ('PostgreSQL'), ('MongoDB');


CREATE TABLE IF NOT EXISTS projects_technologies (
"id" SERIAL PRIMARY KEY,
"addedIn" DATE NOT NULL
);


ALTER TABLE 
	projects_technologies
ADD COLUMN
	"projectId" INTEGER NOT NULL;

ALTER TABLE 
	projects_technologies
ADD COLUMN
	"technologyId" INTEGER NOT NULL;

ALTER TABLE 
projects_technologies
ADD FOREIGN KEY ("projectId") REFERENCES projects("id"); 

ALTER TABLE 
projects_technologies
ADD FOREIGN KEY ("technologyId") REFERENCES technologies("id"); 
