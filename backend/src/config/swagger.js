import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "Portfolio / Blog / Job API Documentation",
    },
    servers: [
      {
        url: "http://localhost:9000/api/v1",
      },
    ],
  },

  apis: [path.join(__dirname, "../routes/*.js")], // adjust relative path
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;