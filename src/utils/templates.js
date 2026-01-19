// Payload templates for different JWT providers/use cases

export const templates = {
  standard: {
    name: 'Standard JWT',
    description: 'Basic JWT with common claims',
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    payload: {
      sub: '1234567890',
      name: 'John Doe',
      email: 'john@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }
  },
  auth0: {
    name: 'Auth0',
    description: 'Auth0 ID Token format',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'auth0-key-id'
    },
    payload: {
      iss: 'https://your-tenant.auth0.com/',
      sub: 'auth0|507f1f77bcf86cd799439011',
      aud: 'your-client-id',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
      azp: 'your-client-id',
      scope: 'openid profile email',
      permissions: ['read:users', 'write:users']
    }
  },
  firebase: {
    name: 'Firebase',
    description: 'Firebase ID Token format',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'firebase-key-id'
    },
    payload: {
      iss: 'https://securetoken.google.com/your-project-id',
      aud: 'your-project-id',
      auth_time: Math.floor(Date.now() / 1000),
      user_id: 'firebase-user-uid',
      sub: 'firebase-user-uid',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      email: 'user@example.com',
      email_verified: true,
      firebase: {
        identities: {
          email: ['user@example.com']
        },
        sign_in_provider: 'password'
      }
    }
  },
  awsCognito: {
    name: 'AWS Cognito',
    description: 'AWS Cognito ID Token format',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'cognito-key-id'
    },
    payload: {
      sub: '12345678-1234-1234-1234-123456789012',
      aud: 'your-app-client-id',
      email_verified: true,
      event_id: 'event-uuid',
      token_use: 'id',
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxx',
      'cognito:username': 'johndoe',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      email: 'john@example.com'
    }
  },
  googleOAuth: {
    name: 'Google OAuth',
    description: 'Google ID Token format',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'google-key-id'
    },
    payload: {
      iss: 'https://accounts.google.com',
      azp: 'your-client-id.apps.googleusercontent.com',
      aud: 'your-client-id.apps.googleusercontent.com',
      sub: '123456789012345678901',
      email: 'user@gmail.com',
      email_verified: true,
      at_hash: 'access-token-hash',
      name: 'John Doe',
      picture: 'https://lh3.googleusercontent.com/a/photo',
      given_name: 'John',
      family_name: 'Doe',
      locale: 'en',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }
  },
  microsoftAzure: {
    name: 'Microsoft Azure AD',
    description: 'Azure AD Access Token format',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'azure-key-id'
    },
    payload: {
      aud: 'api://your-api-id',
      iss: 'https://sts.windows.net/your-tenant-id/',
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      aio: 'azure-internal-id',
      azp: 'your-client-id',
      azpacr: '1',
      name: 'John Doe',
      oid: 'user-object-id',
      preferred_username: 'john@contoso.com',
      rh: 'resource-host',
      scp: 'User.Read',
      sub: 'subject-id',
      tid: 'tenant-id',
      uti: 'unique-token-id',
      ver: '2.0'
    }
  },
  apiGateway: {
    name: 'API Gateway',
    description: 'Generic API access token',
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    payload: {
      sub: 'user-123',
      iss: 'https://api.example.com',
      aud: 'https://api.example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
      scope: 'read write',
      client_id: 'api-client-123',
      jti: 'unique-token-identifier'
    }
  }
};

export const getTemplateList = () => {
  return Object.entries(templates).map(([key, value]) => ({
    key,
    name: value.name,
    description: value.description
  }));
};

export const getTemplate = (templateKey) => {
  const template = templates[templateKey];
  if (!template) return null;
  
  // Return fresh timestamps
  const now = Math.floor(Date.now() / 1000);
  return {
    header: { ...template.header },
    payload: {
      ...template.payload,
      iat: now,
      exp: now + 3600,
      ...(template.payload.auth_time && { auth_time: now }),
      ...(template.payload.nbf && { nbf: now })
    }
  };
};
