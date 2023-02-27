DROP DATABASE if exists dave_app;

CREATE DATABASE dave_app;

CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   username TEXT NOT NULL,
   password TEXT NOT NULL,
   songs INT
);

CREATE TABLE songs(
   id SERIAL PRIMARY KEY,
   name TEXT NOT NULL,
   artist TEXT NOT NULL,
   description TEXT
);