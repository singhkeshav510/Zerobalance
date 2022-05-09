const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']

const doc = {
    info: {
      version: "1.0.0",
      title: "Zerobalance API",
      description: "Documentation for Assignment ",
    },
    host: process.env.APPLICATION_DEV_URL,
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Authentication",
        description: "Endpoints",
      },
      {
        name: "Movie",
        description: "Endpoints",
      },
      {
        name: "User",
        description: "Endpoints",
      },
      {
        name: "GeneralConfig",
        description: "Endpoints",
      },
    ],
  };

swaggerAutogen(outputFile, endpointsFiles,doc).then(() => {
    require('../server.js')
})