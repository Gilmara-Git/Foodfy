DROP DATABASE IF EXISTS dbfoodfy

CREATE DATABASE dbfoodfy


CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text NOT NULL,
  "information" text,
  "chef_id" int NOT NULL,
 --"steps" text[] NOT NULL,
  --"ingredients" text[] NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int NOT NULL,
  "file_id" int NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" int NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- procedure to get updated_at
--CREATE FUNCTION trigger_set_time_stamp() 
--RETURNS TRIGGER AS 
--$$ 
--BEGIN 
--NEW.updated_at = NOW(); 
--RETURN NEW; 
--END; 
--$$ 
--LANGUAGE plpgsql;


--CREATE TRIGGER set_timestamp 
--BEFORE UPDATE ON recipes 
--FOR EACH ROW EXECUTE PROCEDURE trigger_set_time_stamp();

 
--CREATE TRIGGER set_timestamp 
--BEFORE UPDATE ON chefs 
--FOR EACH ROW EXECUTE PROCEDURE trigger_set_time_stamp();




