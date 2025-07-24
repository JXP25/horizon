import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/horizonUser";
import cors from "cors";
import 'json-bigint-patch';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  
  app.use(express.json());
 

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"];
        if (!token) {
          return {};
        }
        try {
          const user = await UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          console.error("Error decoding token", error);
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
