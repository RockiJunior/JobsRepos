const userPropertiesId = {
  id: {
    type: 'string'
  },
  username: {
    type: 'string'
  },
  email: {
    type: 'string'
  }
};

const userProperties = {
  username: {
    type: 'string'
  },
  email: {
    type: 'string'
  },
  password: {
    type: 'string'
  }
};

export const definitions = {
  userByIdResponse: {
    type: 'object',
    properties: userPropertiesId,
    example: {
      id: '62f03a796ab27b8f8ae2acb4',
      username: 'Koloh',
      email: 'luan@gmail.com',
      validated: false
    }
  },

  userCreateRequest: {
    type: 'object',
    properties: userProperties,
    example: {
      username: 'Koloh',
      password: '123456',
      email: 'luan@gmail.com'
    }
  },

  userCreateResponse: {
    type: 'object',
    properties: userPropertiesId,
    example: {
      id: '62f03a796ab27b8f8ae2acb4',
      username: 'Koloh',
      email: 'luan@gmail.com',
      validated: false
    }
  },

  userLoginRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    example: {
      username: 'Koloh',
      password: '123456'
    }
  },

  userLoginResponse: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: userPropertiesId
      },
      token: {
        type: 'string'
      }
    },
    example: {
      user: {
        id: '630b8147dfac43c4cdde8056',
        username: 'Koloh',
        email: 'luan@gmail.com',
        validated: false
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktvbG9oIiwiaWF0IjoxNjYxNjk4NDA2fQ.PuhGBMXhQasSJFcSp44H6dg8xOUsbEKPiLPAm4I8734'
    }
  },

  checkLoggedResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string'
      },
      user: {
        type: 'object',
        properties: userPropertiesId
      }
    },
    example: {
      status: 'logged',
      user: {
        id: '62f03a796ab27b8f8ae2acb4',
        username: 'Koloh',
        email: 'luan@gmail.com',
        validated: false
      }
    }
  },

  userUpdateRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    example: {
      email: 'other@gmail.com'
    }
  },

  userUpdateResponse: {
    type: 'object',
    properties: userPropertiesId,
    example: {
      id: '62f03a796ab27b8f8ae2acb4',
      username: 'Koloh',
      email: 'other@gmail.com',
      validated: false
    }
  }
};

export const paths = {
  '/users/by_id/{id}': {
    get: {
      summary: 'Get user by id',
      tags: ['User'],
      security: [{ User: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'string' },
          required: true,
          example: '62f03a796ab27b8f8ae2acb4'
        }
      ],
      responses: {
        200: {
          description: 'Return a user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userByIdResponse'
              }
            }
          }
        }
      }
    }
  },

  '/users/login': {
    post: {
      summary: 'Login a user',
      tags: ['User'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/userLoginRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Return a created user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userLoginResponse'
              }
            }
          }
        }
      }
    }
  },

  '/users/check_logged/{id}': {
    get: {
      summary: 'Check if user is logged',
      tags: ['User'],
      security: [{ User: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'string' },
          required: true,
          example: '62f03a796ab27b8f8ae2acb4'
        }
      ],
      responses: {
        200: {
          description: 'Return a user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/checkLoggedResponse'
              }
            }
          }
        }
      }
    }
  },

  '/users/create': {
    post: {
      summary: 'Create a user',
      tags: ['User'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/userCreateRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Return a created user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userCreateResponse'
              }
            }
          }
        }
      }
    }
  },

  '/users/update/{id}': {
    put: {
      summary: 'Update a user',
      tags: ['User'],
      security: [{ User: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'string' },
          required: true,
          example: '62f03a796ab27b8f8ae2acb4'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/userUpdateRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Return a updated user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userUpdateResponse'
              }
            }
          }
        }
      }
    }
  },

  '/users/delete/{id}': {
    delete: {
      summary: 'Delete a user',
      tags: ['User'],
      security: [{ User: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'string' },
          required: true,
          example: '62f03a796ab27b8f8ae2acb4'
        }
      ],
      responses: {
        200: {
          description: 'Return a deleted user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userCreateResponse'
              }
            }
          }
        }
      }
    }
  }
};
