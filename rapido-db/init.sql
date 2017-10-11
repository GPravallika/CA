alter user rapidoadmin with encrypted password 'rapidopass';
GRANT ALL PRIVILEGES ON DATABASE rapido TO rapidoadmin;

-- Create sequence for user.
Create sequence users_id_seq;

-- Create user table. Email is primary key.
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    firstname character varying COLLATE pg_catalog."default",
    lastname character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    isactive boolean,
    isverified boolean,
    secretkey text COLLATE pg_catalog."default",
    createdat timestamp with time zone DEFAULT now(),
    modifiedat timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
) WITHOUT OIDS;

-- Create sequence for user verify table for auto increment.
Create sequence user_verify_id_seq;

-- Email aaccount verificatin purpose, once email account verified then the data will be deleted by app automatically.
-- Stale data can be there, write the code to remove the stale data from this table.
CREATE TABLE public.user_verify
(
    id integer NOT NULL DEFAULT nextval('user_verify_id_seq'::regclass),
    userid bigint,
    verifytoken character varying COLLATE pg_catalog."default",
    CONSTRAINT user_verify_pkey PRIMARY KEY (id)
) WITHOUT OIDS;

-- Create sequence for project table for auto increment.
Create sequence projects_id_seq;

-- Projects table will contain all the user associated project data.
CREATE TABLE public.projects
(
    id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    userid bigint,
    createdat timestamp with time zone NOT NULL DEFAULT now(),
    modifiedat timestamp with time zone DEFAULT now(),
    createdby bigint,
    modifiedby bigint,
    treedata jsonb,
    vocabulary jsonb,
    apidetails jsonb,
    CONSTRAINT projects_pkey PRIMARY KEY (id)
) WITHOUT OIDS;
