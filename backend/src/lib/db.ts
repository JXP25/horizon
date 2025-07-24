import { AppDataSource } from "../data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("TypeORM connected to Postgres");
  })
  .catch((error) => console.log(error));

export default AppDataSource;