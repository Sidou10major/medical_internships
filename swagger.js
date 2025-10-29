const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Medical Internships Management API',
      version: '1.0.0',
      description: 'API documentation for Medical Internships Management System',
      contact: {
        name: 'Boudaoud Sid Ahmed',
        email: 'js_boudaoud@esi.dz',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Auto-scan route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📘 Swagger docs available at http://localhost:5000/api-docs');
}

module.exports = { swaggerDocs };
