alter user rapidoadmin with encrypted password 'rapidopass';
GRANT ALL PRIVILEGES ON DATABASE rapido TO rapidoadmin;

-- Create sequence for user.
Create sequence users_id_seq;

-- Create user table. Email is primary key.
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    firstname text,
    lastname text,
    password text,
    email text,
    isverified boolean,
    createdat timestamp with time zone DEFAULT now(),
    modifiedat timestamp with time zone DEFAULT now(),
    teams text[],
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
    verifytoken text,
    CONSTRAINT user_verify_pkey PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE public.tokens
(
    userid bigint,
    secret text,
    issuedat timestamp with time zone DEFAULT now()
) WITHOUT OIDS;

Create sequence team_id_seq;

CREATE TABLE public.teams
(
    id integer NOT NULL DEFAULT nextval('team_id_seq'::regclass),
    name text,
    description text,
    createdat timestamp with time zone DEFAULT now(),
    owner bigint
) WITHOUT OIDS;

CREATE TABLE public.user_team_workflow
(
    guestid bigint,
    hostid bigint,
    teamid bigint,
    createdat timestamp with time zone DEFAULT now(),
    createdby bigint,
    modifiedby bigint,
    action bigint
) WITHOUT OIDS;

-- Create sequence for project table for auto increment.
Create sequence projects_id_seq;

-- Projects table will contain all the user associated project data.
CREATE TABLE public.projects
(
    id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    name text,
    description text COLLATE pg_catalog."default",
    userid bigint,
    createdat timestamp with time zone NOT NULL DEFAULT now(),
    modifiedat timestamp with time zone DEFAULT now(),
    createdby bigint,
    modifiedby bigint,
    treedata jsonb,
    vocabulary jsonb,
    apidetails jsonb,
    teams bigint[],
    CONSTRAINT projects_pkey PRIMARY KEY (id)
) WITHOUT OIDS;
