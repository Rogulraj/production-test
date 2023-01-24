const express = require("express");

const app = express();

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const cors = require("cors");

const dbPath = path.join(__dirname, "test.db");

let db = null;

const connect = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
      mode: 2,
    });
    app.listen(3030, () => {
      console.log("server at 3030");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
connect();

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", async (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.post("/api/create", async (req, res) => {
  try {
    const createQuery = `
        CREATE TABLE user (id INT NOT NULL PRIMARY KEY, name VARCHAR(200))
    `;
    const createResponse = await db.run(createQuery);
    res.send({ success: "Table Created Successfully" });
  } catch (e) {
    res.send({ failed: "Table Already Exist" });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const { id, name } = req.body;
    const addQuery = `
          INSERT INTO user (id, name)
          VALUES (${id}, '${name}')
      `;
    const addResponse = await db.run(addQuery);
    res.send({ success: `user ${name} added Successfully` });
  } catch (e) {
    res.send({ failed: e });
  }
});

app.get("/api/get", async (req, res) => {
  try {
    const getQuery = `
            SELECT * FROM user
        `;
    const getResponse = await db.all(getQuery);
    res.send(getResponse);
  } catch (e) {
    res.send({ error: e });
  }
});
