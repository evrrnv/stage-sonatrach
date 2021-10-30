require("dotenv").config();
const express = require("express");
const path = require("path");
const { postgraphile } = require("postgraphile");
const Keycloak = require("./lib/keycloak-verify");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const { Client } = require("pg");
const format = require("pg-format");

const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/upload-attachments", async (req, res) => {
  const problemId = req.body.id;

  const paths = Object.keys(req.files).map(async (key) => {
    const fp = await resolveUpload(req.files[key]);
    return fp;
  });

  Promise.all(paths).then(async (values) => {
    const client = new Client(DATABASE_URL);
    client.connect();

    const data = values.map(({ name, url }) => [name, url, problemId]);

    client.query(
      format(
        "INSERT INTO app.attachment (name, url, problem_id) VALUES %L RETURNING id, name",
        data
      ),
      [],
      (err, result) => {
        if (err) console.log(err);

        const send = result.rows.map(({ id, name }) => {
          return {
            "__typename": "Attachment",
            "id": id,
            "name": name
          }
        })

        res.send(send)
      }
    );
  });
});

app.use("/attachments", express.static(path.resolve("attachments")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", (req, res, next) => {
    if (req.url === "/graphiql" || req.url === "/graphql") return next();
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}

const config = {
  realm: process.env.KEYCLOAK_REALME,
  authServerUrl: process.env.KEYCLOAK_URL,
};
const keycloak = Keycloak(config);

const canSplit = (str, token) => {
  return (str || "").split(token).length > 1;
};

app.use(
  postgraphile(DATABASE_URL, "app", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: (req) => {
      return true;
    },
    appendPlugins: [ConnectionFilterPlugin],
    pgSettings: async (req) => {
      const authorization = req.headers.authorization;
      const bearerStr = "Bearer";
      if (canSplit(authorization, bearerStr)) {
        const token = authorization.split(bearerStr);
        if (token.length > 1) {
          try {
            const user = await keycloak.verifyOnline(token[1]);
            const role = user.resourceAccess.web.roles[0];
            const id = user.id.split(":")[2];
            return {
              "jwt.claims.user_id": id,
              role: role.toLowerCase(),
            };
          } catch (e) {
            console.log(e);
          }
        }
      }

      return {
        role: "anonymous",
      };
    },
  })
);

app.listen(process.env.PORT || 4000);

async function resolveUpload(upload) {
  const timestamp = new Date().toISOString().replace(/\D/g, "");
  const id = `${timestamp}_${upload.name}`;
  const filepath = path.join("attachments", id);
  const fsPath = path.join(process.cwd(), filepath);

  return new Promise((resolve, reject) => {
    upload.mv(fsPath, (err) => {
      if (err) reject(err);
      resolve({
        name: id,
        url: fsPath,
      });
    });
  });
}
