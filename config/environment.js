const { env } = process;

const config = {
  env: env.NODE_ENV || "development"
};

const devConfig = {
  db: "mongodb://localhost:27017/todo-api",
  secrets: {
    session: "First session."
  }
};

const prodConfig = {
  db: env.MONGO_URL,
  secrets: {
    session: env.SESSION_SECRET
  }
};

const currentConfig = config.env === "production" ? prodConfig : devConfig;

module.exports = Object.assign({}, config, currentConfig);