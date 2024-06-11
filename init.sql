SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA shop;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE shop.users (
    id serial PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL,
    password_hash character(64) NOT NULL,
    cart jsonb DEFAULT '{}'::json NOT NULL,
    role varchar(12) DEFAULT 'user' NOT NULL,
    saved smallint[] DEFAULT '{}'::smallint[] NOT NULL,
    votes jsonb DEFAULT '{}'::jsonb NOT NULL,

		CONSTRAINT name_len CHECK ((char_length((name)::text) > 0)) NOT VALID
);



CREATE TABLE shop.brands (
    id serial PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL,
    images varchar(12)[] DEFAULT ARRAY['template.jpg'::character varying] NOT NULL,

    CONSTRAINT single_image CHECK ((array_length(images,1) = 1)),
    CONSTRAINT name_length CHECK ((char_length((name)::text) > 0))
);


CREATE TABLE shop.categories (
    id serial PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL,
    images varchar(12)[] DEFAULT ARRAY['template.jpg'::character varying] NOT NULL,

    CONSTRAINT single_image CHECK ((array_length(images,1) = 1)),
    CONSTRAINT name_lenth CHECK ((char_length((name)::text) > 0))
);

CREATE TABLE shop.discounts (
    id serial PRIMARY KEY,
    discount integer NOT NULL,
    expires timestamp without time zone DEFAULT (LOCALTIMESTAMP(1) + '00:05:00'::interval) NOT NULL,
    products smallint[] DEFAULT ARRAY[]::smallint[] NOT NULL,
    brands smallint[] DEFAULT ARRAY[]::smallint[] NOT NULL,
    categories smallint[] DEFAULT ARRAY[]::smallint[] NOT NULL
);

CREATE INDEX discounts_value ON shop.discounts USING btree (discount DESC NULLS LAST);


CREATE TABLE shop.orders (
    id serial PRIMARY KEY,
		code UUID DEFAULT gen_random_uuid(),
    order_content jsonb NOT NULL,
    rating smallint DEFAULT 0,
    status varchar(20) DEFAULT 'PROCESSING'  NOT NULL,
    user_id serial REFERENCES shop.users(id),
    seen boolean DEFAULT false NOT NULL
);


CREATE TABLE shop.products (
    id serial PRIMARY KEY,
    name varchar(64) NOT NULL,
    brand serial REFERENCES shop.brands(id) ON UPDATE CASCADE ON DELETE CASCADE,
    category serial REFERENCES shop.categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    description varchar(8192) DEFAULT 'This is default description'::character varying NOT NULL,
    images varchar(12)[] DEFAULT ARRAY['template.jpg'::character varying] NOT NULL,
    price integer DEFAULT 22000 NOT NULL,
    votes integer DEFAULT 0,
    voters smallint DEFAULT 0 NOT NULL,
    rating real GENERATED ALWAYS AS ((votes / NULLIF(voters, 0))) STORED,

		CONSTRAINT unique_name_brand UNIQUE (name, brand),
    CONSTRAINT name_len CHECK ((char_length((name)::text) > 0)),
    CONSTRAINT price_min CHECK ((price > ((0)::numeric)::double precision)),
		CONSTRAINT description_len CHECK ((char_length((name)::text) > 0)) NOT VALID
);

INSERT INTO shop.users (name, password_hash, role)
VALUES ('admin', 'admin','admin');
INSERT INTO shop.users (name, password_hash, role)
VALUES ('user', 'user','user');

INSERT INTO shop.brands (name)
VALUES
('Lorem'),
('Ipsum');

INSERT INTO shop.categories (name)
VALUES
('Headphones'),
('Headrests'),
('Smartphones'),
('Laptops');
