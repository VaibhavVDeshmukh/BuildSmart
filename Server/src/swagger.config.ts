import swaggerJsdoc, { Options as SwaggerOptions } from "swagger-jsdoc";
const options: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "S2M GIS Api",
      version: "1.0.0",
      description: "A node js rest api to handle gis related services",
    },
  },
  apis: ["./src/**/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
