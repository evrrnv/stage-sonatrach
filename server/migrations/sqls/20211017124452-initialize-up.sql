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

GRANT SELECT ON app.user_account TO c1, c2, c3;

-- user roles

CREATE TABLE app.user_roles (
    user_id uuid REFERENCES app.user_account (id),
    role_id uuid REFERENCES app.role (id),
    PRIMARY KEY(user_id, role_id)
);

COMMENT ON TABLE app.user_roles is E'@simpleCollections only';

-- updated at

CREATE FUNCTION app.set_current_timestamp_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_app_private_user_account_updated_at BEFORE UPDATE ON app_private.user_account FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();
CREATE TRIGGER set_app_user_account_updated_at BEFORE UPDATE ON app.user_account FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();
CREATE TRIGGER set_app_role_updated_at BEFORE UPDATE ON app.role FOR EACH ROW EXECUTE FUNCTION app.set_current_timestamp_updated_at();

---

WITH private_account AS (INSERT INTO app_private.user_account (id, keycloak_id, username, password) VALUES ('9ecb9eb1-1177-45c9-9062-2455503ca558', 'd0fab127-8d85-4086-b898-a52881cfabcb', 'a.bousmat', 'password') RETURNING id)
INSERT INTO app.user_account(id, email, last_name, first_name)
VALUES ((SELECT id FROM private_account), 'a.bousmat@esi-sba.dz', 'Bousmat', 'Abdelmounaim') RETURNING id;

WITH private_account AS (INSERT INTO app_private.user_account (id, keycloak_id, username, password) VALUES ('dc695e58-3a7d-47b8-b3fd-cbe29c52d0c5', '2da0a230-bbdd-492d-9974-d388814d0c6e', 'k.benzema', 'password') RETURNING id)
INSERT INTO app.user_account(id, email, last_name, first_name)
VALUES ((SELECT id FROM private_account), 'k.benzema@esi-sba.dz', 'Karim', 'Benzema') RETURNING id;

INSERT INTO app.role (id, name, type, code) VALUES ('02cf8db1-d614-44c5-a317-fcfdc9d0ae6d', 'Client 1', 1, 'C1');
INSERT INTO app.role (id, name, type, code) VALUES ('20a20fd5-77ee-46ce-b253-c7b6a4d7aaf8', 'Client 2', 1, 'C2');
INSERT INTO app.role (id, name, type, code) VALUES ('97262f49-2552-46c0-b071-b8f2fec99ef7', 'Client 3', 1, 'C3');

DELETE FROM app.user_roles WHERE app.user_roles.user_id = (SELECT id FROM app_private.user_account WHERE username = 'a.bousmat') AND app.user_roles.role_id = (SELECT id FROM app.role WHERE code = 'C1');

-- SELECT code FROM app_private.user_account INNER JOIN app.user_account ON app.user_account.id = app_private.user_account.id AND username = 'a.bousmat' INNER JOIN app.user_roles ON app.user_account.id = app.user_roles.user_id INNER JOIN app.role ON app.user_roles.role_id = app.role.id;

-- INSERT INTO app.user_roles (user_id, role_id) VALUES ((SELECT id FROM app_private.user_account WHERE username = 'a.bousmat'), (SELECT id FROM app.role WHERE code = 'C1'));

-- SELECT id FROM app.role WHERE code = 'C3';
-- SELECT id FROM app_private.user_account WHERE username = 'a.bousmat';