CREATE SCHEMA app;
CREATE SCHEMA app_private;

CREATE ROLE c1;
CREATE ROLE c2;
CREATE ROLE c3;
CREATE ROLE admin;
CREATE ROLE anonymous;

REVOKE ALL ON SCHEMA PUBLIC FROM PUBLIC;

ALTER DEFAULT PRIVILEGES REVOKE ALL ON FUNCTIONS FROM PUBLIC;

ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, UPDATE, DELETE, INSERT ON TABLES TO admin;

GRANT USAGE ON SCHEMA app TO c1, c2, c3, admin, anonymous;

CREATE EXTENSION "uuid-ossp";
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO c1, c2, c3, admin;

-- role

CREATE TABLE app.role (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    code TEXT UNIQUE,
    type int check(type = 1 OR type = 2),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

GRANT SELECT ON app.role TO c1, c2, c3;

COMMENT ON COLUMN app.role.id is E'@omit create';
COMMENT ON COLUMN app.role.created_at is E'@omit create,update,delete';
COMMENT ON COLUMN app.role.updated_at is E'@omit create,update,delete';

-- private user account

CREATE TABLE app_private.user_account (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    keycloak_id TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- user account

CREATE TABLE app.user_account (
    id uuid PRIMARY KEY REFERENCES app_private.user_account (id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    last_name TEXT,
    first_name TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

COMMENT ON TABLE app.user_account is E'@omit create';

GRANT SELECT ON app.user_account TO c1, c2, c3;

-- user roles

CREATE TABLE app.user_roles (
    user_id uuid REFERENCES app.user_account (id),
    role_id uuid REFERENCES app.role (id),
    PRIMARY KEY(user_id, role_id)
);

GRANT SELECT ON app.user_roles TO c1, c2, c3;

COMMENT ON TABLE app.user_roles is E'@simpleCollections only';

-- problem status

CREATE TABLE app.problem_status (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

GRANT SELECT ON app.problem_status TO c1, c2, c3;

COMMENT ON COLUMN app.problem_status.id is E'@omit create';
COMMENT ON COLUMN app.problem_status.created_at is E'@omit create,update,delete';
COMMENT ON COLUMN app.problem_status.updated_at is E'@omit create,update,delete';

-- insert problem status data

INSERT INTO app.problem_status (id, name) VALUES ('903fad01-0f26-4e2e-be3f-2e044dc01f7a', 'En attente');
INSERT INTO app.problem_status (id, name) VALUES ('d21d2f10-56f2-49cd-97f7-bb652bc39eaf', 'En traitement');
INSERT INTO app.problem_status (id, name) VALUES ('e2565d00-e76c-474a-b5b3-c4b799edfd5d', 'Traité');
INSERT INTO app.problem_status (id, name) VALUES ('85cb5e7e-8323-4254-8078-d6e189d3280e', 'Non traitable');

CREATE FUNCTION app.get_pending_problem_status_id() RETURNS uuid AS $$
    SELECT id FROM app.problem_status WHERE name = 'En attente';
$$ LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION app.get_pending_problem_status_id() TO c1, c2;

-- problem

CREATE TABLE app.problem (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status uuid NOT NULL DEFAULT app.get_pending_problem_status_id() REFERENCES app.problem_status (id),
    created_by uuid NOT NULL REFERENCES app.user_account (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON app.problem TO c1, c2, c3;

ALTER TABLE app.problem ENABLE ROW LEVEL SECURITY;

CREATE POLICY c1_c2_insert_problem ON app.problem FOR INSERT TO c1, c2 WITH CHECK (TRUE);

CREATE POLICY c1_select_problem ON app.problem FOR SELECT TO c1 USING
    (created_by = current_setting('jwt.claims.user_id', TRUE)::uuid);

CREATE POLICY c2_update_problem ON app.problem FOR UPDATE TO c2 USING
     ((
        SELECT 
        CASE WHEN 
        (SELECT code FROM app.user_roles 
            INNER JOIN app.role 
            ON created_by = app.user_roles.user_id AND app.user_roles.role_id = app.role.id
        ) IN ('C1') OR created_by = current_setting('jwt.claims.user_id', TRUE)::uuid THEN TRUE ELSE FALSE END
    ));

CREATE POLICY c2_select_problem ON app.problem FOR SELECT TO c2 USING
    ((
        SELECT 
        CASE WHEN 
        (SELECT code FROM app.user_roles 
            INNER JOIN app.role 
            ON created_by = app.user_roles.user_id AND app.user_roles.role_id = app.role.id
        ) IN ('C1') OR created_by = current_setting('jwt.claims.user_id', TRUE)::uuid THEN TRUE ELSE FALSE END
    ));

CREATE POLICY c3_update_problem ON app.problem FOR UPDATE TO c3 USING
     ((
        SELECT 
        CASE WHEN 
        (SELECT code FROM app.user_roles 
            INNER JOIN app.role 
            ON created_by = app.user_roles.user_id AND app.user_roles.role_id = app.role.id
        ) IN ('C1', 'C2') OR created_by = current_setting('jwt.claims.user_id', TRUE)::uuid THEN TRUE ELSE FALSE END
    ));

CREATE POLICY c3_select_problem ON app.problem FOR SELECT TO c3 USING
    ((
        SELECT 
        CASE WHEN 
        (SELECT code FROM app.user_roles 
            INNER JOIN app.role 
            ON created_by = app.user_roles.user_id AND app.user_roles.role_id = app.role.id
        ) IN ('C1', 'C2') OR created_by = current_setting('jwt.claims.user_id', TRUE)::uuid THEN TRUE ELSE FALSE END
    ));

COMMENT ON TABLE app.problem is E'@omit delete';
COMMENT ON COLUMN app.problem.id is E'@omit update,create';
COMMENT ON COLUMN app.problem.created_at is E'@omit update,create';
COMMENT ON COLUMN app.problem.updated_at is E'@omit update,create';
COMMENT ON COLUMN app.problem.created_by is E'@omit update,create';

-- attachment

CREATE TABLE app.attachment(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    unique_name TEXT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    problem_id uuid REFERENCES app.problem(id)
);

GRANT SELECT ON app.attachment TO c1, c2, c3;
GRANT INSERT ON app.attachment TO c1, c2;

COMMENT ON COLUMN app.attachment.id is E'@omit create';
COMMENT ON COLUMN app.attachment.created_at is E'@omit create,update,delete';
COMMENT ON COLUMN app.attachment.url is E'@omit';

-- problem created by trigger

CREATE FUNCTION app.set_problem_created_by() RETURNS TRIGGER AS $$
BEGIN
    NEW.created_by = current_setting('jwt.claims.user_id', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER problem_created_by_trigger BEFORE INSERT ON app.problem FOR EACH ROW EXECUTE FUNCTION app.set_problem_created_by();

-- updated at trigger

CREATE FUNCTION app.set_current_timestamp_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_app_private_user_account_updated_at BEFORE UPDATE ON app_private.user_account FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();
CREATE TRIGGER set_app_user_account_updated_at BEFORE UPDATE ON app.user_account FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();
CREATE TRIGGER set_app_role_updated_at BEFORE UPDATE ON app.role FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();

-- current user

CREATE FUNCTION app.current_user() RETURNS app.user_account AS $$
    SELECT * FROM app.user_account WHERE id = nullif(current_setting('jwt.claims.user_id', true), '')::uuid
$$ LANGUAGE SQL STABLE;

GRANT EXECUTE ON FUNCTION app.current_user() TO c1, c2, c3;


--------------------------------------------------

-- insert role data

INSERT INTO app.role (id, name, type, code) VALUES ('02cf8db1-d614-44c5-a317-fcfdc9d0ae6d', 'Client 1', 1, 'C1');
INSERT INTO app.role (id, name, type, code) VALUES ('20a20fd5-77ee-46ce-b253-c7b6a4d7aaf8', 'Client 2', 1, 'C2');
INSERT INTO app.role (id, name, type, code) VALUES ('97262f49-2552-46c0-b071-b8f2fec99ef7', 'Client 3', 1, 'C3');

-- insert user data

WITH private_account AS (INSERT INTO app_private.user_account (id, keycloak_id, username, password) VALUES ('9ecb9eb1-1177-45c9-9062-2455503ca558', 'd0fab127-8d85-4086-b898-a52881cfabcb', 'a.bousmat', 'password') RETURNING id)
INSERT INTO app.user_account(id, email, last_name, first_name)
VALUES ((SELECT id FROM private_account), 'a.bousmat@esi-sba.dz', 'Bousmat', 'Abdelmounaim') RETURNING id;

WITH private_account AS (INSERT INTO app_private.user_account (id, keycloak_id, username, password) VALUES ('dc695e58-3a7d-47b8-b3fd-cbe29c52d0c5', '2da0a230-bbdd-492d-9974-d388814d0c6e', 'k.benzema', 'password') RETURNING id)
INSERT INTO app.user_account(id, email, last_name, first_name)
VALUES ((SELECT id FROM private_account), 'k.benzema@esi-sba.dz', 'Benzema', 'Karim') RETURNING id;

WITH private_account AS (INSERT INTO app_private.user_account (id, keycloak_id, username, password) VALUES ('4f9c73b7-98fa-43a0-aac5-fc2e3a60d18e', '7ea23851-410f-4ea3-920c-95f7753e5162', 'l.belounis', 'password') RETURNING id)
INSERT INTO app.user_account(id, email, last_name, first_name)
VALUES ((SELECT id FROM private_account), 'l.belounis@esi-sba.dz', 'Lounes', 'Belounis') RETURNING id;

-- insert user roles data

INSERT INTO app.user_roles (user_id, role_id) VALUES ('4f9c73b7-98fa-43a0-aac5-fc2e3a60d18e', '02cf8db1-d614-44c5-a317-fcfdc9d0ae6d');
INSERT INTO app.user_roles (user_id, role_id) VALUES ('dc695e58-3a7d-47b8-b3fd-cbe29c52d0c5', '20a20fd5-77ee-46ce-b253-c7b6a4d7aaf8');
INSERT INTO app.user_roles (user_id, role_id) VALUES ('9ecb9eb1-1177-45c9-9062-2455503ca558', '97262f49-2552-46c0-b071-b8f2fec99ef7');
