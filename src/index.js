
import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";


const bootstrap = async () => {
    await initMongoConnection();
    console.log('Mongo connection successfully established!')
    setupServer();
  };

  bootstrap();
