// JWT utility functions using jose library
import * as jose from 'jose';

/**
 * Supported algorithms
 */
export const ALGORITHMS = {
  HS256: { name: 'HS256', type: 'symmetric', description: 'HMAC using SHA-256' },
  HS384: { name: 'HS384', type: 'symmetric', description: 'HMAC using SHA-384' },
  HS512: { name: 'HS512', type: 'symmetric', description: 'HMAC using SHA-512' },
  RS256: { name: 'RS256', type: 'asymmetric', description: 'RSA using SHA-256' },
  RS384: { name: 'RS384', type: 'asymmetric', description: 'RSA using SHA-384' },
  RS512: { name: 'RS512', type: 'asymmetric', description: 'RSA using SHA-512' },
  ES256: { name: 'ES256', type: 'asymmetric', description: 'ECDSA using P-256 and SHA-256' },
  ES384: { name: 'ES384', type: 'asymmetric', description: 'ECDSA using P-384 and SHA-384' },
  ES512: { name: 'ES512', type: 'asymmetric', description: 'ECDSA using P-521 and SHA-512' },
  PS256: { name: 'PS256', type: 'asymmetric', description: 'RSA-PSS using SHA-256' },
  PS384: { name: 'PS384', type: 'asymmetric', description: 'RSA-PSS using SHA-384' },
  PS512: { name: 'PS512', type: 'asymmetric', description: 'RSA-PSS using SHA-512' },
};

/**
 * Base64URL encode
 */
export const base64UrlEncode = (str) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return jose.base64url.encode(data);
  } catch {
    return null;
  }
};

/**
 * Base64URL decode
 */
export const base64UrlDecode = (str) => {
  try {
    const data = jose.base64url.decode(str);
    const decoder = new TextDecoder();
    return decoder.decode(data);
  } catch {
    return null;
  }
};

/**
 * Decode a JWT token without verification
 * @param {string} token - The JWT token string
 * @returns {object} { header, payload, signature, isValid }
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return { header: null, payload: null, signature: null, error: 'No token provided' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: null, error: 'Invalid token format' };
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const payloadJson = base64UrlDecode(parts[1]);
    
    if (!headerJson || !payloadJson) {
      return { header: null, payload: null, signature: null, error: 'Invalid base64 encoding' };
    }

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);
    const signature = parts[2];

    return { header, payload, signature, error: null };
  } catch (e) {
    return { header: null, payload: null, signature: null, error: `Parse error: ${e.message}` };
  }
};

/**
 * Encode a JWT token with HS256
 * @param {object} header - JWT header
 * @param {object} payload - JWT payload
 * @param {string} secret - Secret key for signing
 * @returns {Promise<string>} The encoded JWT token
 */
export const encodeTokenHS = async (header, payload, secret) => {
  try {
    const alg = header.alg || 'HS256';
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);
    
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ ...header, alg })
      .sign(secretKey);
    
    return { token: jwt, error: null };
  } catch (e) {
    return { token: null, error: `Encoding error: ${e.message}` };
  }
};

/**
 * Encode a JWT token with RS256 or other asymmetric algorithms
 * @param {object} header - JWT header
 * @param {object} payload - JWT payload
 * @param {string} privateKeyPem - Private key in PEM format
 * @returns {Promise<string>} The encoded JWT token
 */
export const encodeTokenRS = async (header, payload, privateKeyPem) => {
  try {
    const alg = header.alg || 'RS256';
    const privateKey = await jose.importPKCS8(privateKeyPem, alg);
    
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ ...header, alg })
      .sign(privateKey);
    
    return { token: jwt, error: null };
  } catch (e) {
    return { token: null, error: `Encoding error: ${e.message}` };
  }
};

/**
 * Verify a JWT token with HS256
 * @param {string} token - The JWT token
 * @param {string} secret - Secret key
 * @returns {Promise<object>} Verification result
 */
export const verifyTokenHS = async (token, secret) => {
  try {
    if (!token || !secret) {
      return { isValid: false, error: 'Token and secret are required' };
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);
    
    const { payload, protectedHeader } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256', 'HS384', 'HS512']
    });
    
    return { isValid: true, payload, header: protectedHeader, error: null };
  } catch (e) {
    return { isValid: false, error: e.message };
  }
};

/**
 * Verify a JWT token with RS256 or other asymmetric algorithms
 * @param {string} token - The JWT token
 * @param {string} publicKeyPem - Public key in PEM format
 * @returns {Promise<object>} Verification result
 */
export const verifyTokenRS = async (token, publicKeyPem) => {
  try {
    if (!token || !publicKeyPem) {
      return { isValid: false, error: 'Token and public key are required' };
    }

    // Try to detect the algorithm from the token header
    const { header } = decodeToken(token);
    const alg = header?.alg || 'RS256';
    
    const publicKey = await jose.importSPKI(publicKeyPem, alg);
    
    const { payload, protectedHeader } = await jose.jwtVerify(token, publicKey, {
      algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512']
    });
    
    return { isValid: true, payload, header: protectedHeader, error: null };
  } catch (e) {
    return { isValid: false, error: e.message };
  }
};

/**
 * Create an unsigned token (for display purposes when no secret is provided)
 * @param {object} header - JWT header
 * @param {object} payload - JWT payload
 * @returns {string} Unsigned JWT token with empty signature
 */
export const createUnsignedToken = (header, payload) => {
  try {
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    return `${headerEncoded}.${payloadEncoded}.`;
  } catch {
    return null;
  }
};

/**
 * Get the color-coded parts of a JWT for display
 * @param {string} token - The JWT token
 * @returns {object} { header, payload, signature } - Each part as a string
 */
export const getTokenParts = (token) => {
  if (!token) return { header: '', payload: '', signature: '' };
  
  const parts = token.split('.');
  return {
    header: parts[0] || '',
    payload: parts[1] || '',
    signature: parts[2] || ''
  };
};

/**
 * Check if algorithm is symmetric (uses shared secret)
 * @param {string} alg - Algorithm name
 * @returns {boolean}
 */
export const isSymmetricAlgorithm = (alg) => {
  return ['HS256', 'HS384', 'HS512'].includes(alg);
};

/**
 * Check if algorithm is asymmetric (uses public/private key pair)
 * @param {string} alg - Algorithm name
 * @returns {boolean}
 */
export const isAsymmetricAlgorithm = (alg) => {
  return ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512'].includes(alg);
};

/**
 * Generate a sample RSA key pair (for demo purposes)
 * Note: In production, keys should be generated securely
 */
export const generateKeyPair = async (alg = 'RS256') => {
  try {
    const { publicKey, privateKey } = await jose.generateKeyPair(alg);
    
    const publicKeyPem = await jose.exportSPKI(publicKey);
    const privateKeyPem = await jose.exportPKCS8(privateKey);
    
    return { publicKey: publicKeyPem, privateKey: privateKeyPem, error: null };
  } catch (e) {
    return { publicKey: null, privateKey: null, error: e.message };
  }
};
