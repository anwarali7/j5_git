import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/routes.js";

// ==========
// MongoDB initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.set("strictQuery", false);
/*
https://stackoverflow.com/questions/69957163/mongooseserverselectionerror-connect-econnrefused-127017-in-node-v17-and-mon
https://dba.stackexchange.com/questions/173781/bind-mongodb-to-ipv4-as-well-as-ipv6/302609#302609
If it doesn't work with localhost, change /bin/mongod.cfg file like so :

  # network interfaces
  net:
    ipv6: true
    port: 27017
    bindIpAll: true

(Or use 127.0.0.1 instead of localhost.)
*/
mongoose.connect(`mongodb://${APP_HOSTNAME}:27017/students`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(init);

async function init() {

  // ==========
  // App initialization
  // ==========

  const app = express();
  app.set("view engine", "pug");
  app.locals.pretty = (NODE_ENV !== 'production'); // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

  // ==========
  // App middlewares
  // ==========

  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: true,
  }));

  // ==========
  // App routers
  // ==========

  app.use(router);

  // ==========
  // App start
  // ==========

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
  });
}