/* eslint-disable import/prefer-default-export */
import * as User from './docs/UserDocs';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'CUCICBA Intranet API'
  },
  consumes: ['application/json'],
  produces: ['application/json'],
  schemes: ['http', 'https'],
  components: {
    securitySchemes: {
      User: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'Token:\n\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktvbG9oIiwiaWF0IjoxNjU5OTE3MTU3fQ.iHsCPlINhjfXSs0YuFsPjSUEc2oybIKEthp60tNRx2o\n\n'
      }
    }
  },
  paths: {
    ...User.paths,

  },
  definitions: {
    ...User.definitions,
 
  }
};
