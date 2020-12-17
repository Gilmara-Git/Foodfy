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

-- reset_token and reset_token_expires were added afterwards 
-- I had tried put reset_token_expires as timestamp default now, to validate token expiratin
-- but reset_token and reset_token_expires were not being recorded on the database 


ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- procedure to update the FIELD updated_at
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

-- connect-pg-simple TABLE
--CREATE TABLE "session" (
--  "sid" varchar NOT NULL COLLATE "default",
--	"sess" json NOT NULL,
--	"expire" timestamp(6) NOT NULL DEFAULT (now())
--)
--WITH (OIDS=FALSE);

--ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- cascade delete
--ALTER TABLE "recipes"
--DROP CONSTRAINT recipes_user_id_fkey,
--ADD CONSTRAINT recipes_user_id_fkey
--FOREIGN KEY ("user_id")
--REFERENCES "users" ("id")
--ON DELETE CASCADE; 


--ALTER TABLE "recipes"
--DROP CONSTRAINT recipes_chef_id_fkey,
--ADD CONSTRAINT recipes_chef_id_fkey
--FOREIGN KEY ("chef_id")
--REFERENCES "chefs" ("id")
--ON DELETE CASCADE;


--ALTER TABLE "recipe_files"
--DROP CONSTRAINT recipe_files_recipe_id_fkey,
--ADD CONSTRAINT recipe_files_recipe_id_fkey
--FOREIGN KEY ("recipe_id")
--REFERENCES "recipes" ("id")
--ON DELETE CASCADE;

--ALTER TABLE "recipe_files"
--DROP CONSTRAINT recipe_files_file_id_fkey,
--ADD CONSTRAINT recipe_files_file_id_fkey
--FOREIGN KEY ("file_id")
--REFERENCES "files" ("id")
--ON DELETE CASCADE;

--ALTER TABLE "chefs"
--DROP CONSTRAINT chefs_file_id_fkey,
--ADD CONSTRAINT chefs_file_id_fkey
--FOREIGN KEY ("file_id")
--REFERENCES "files" ("id")
--ON DELETE CASCADE;