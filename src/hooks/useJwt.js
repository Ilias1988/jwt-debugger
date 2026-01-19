import { useState, useCallback, useEffect, useRef } from 'react';
import {
  decodeToken,
  encodeTokenHS,
  encodeTokenRS,
  verifyTokenHS,
  verifyTokenRS,
  isSymmetricAlgorithm,
  createUnsignedToken
} from '../utils/jwtUtils';

const DEFAULT_HEADER = { alg: 'HS256', typ: 'JWT' };
const DEFAULT_PAYLOAD = {
  sub: '1234567890',
  name: 'John Doe',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600
};
const DEFAULT_SECRET = 'your-256-bit-secret';

// Sample JWT for initial display
const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const useJwt = () => {
  // Core state
  const [encodedToken, setEncodedToken] = useState('');
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState(DEFAULT_SECRET);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  
  // Validation state
  const [isValid, setIsValid] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [parseError, setParseError] = useState(null);
  
  // Flags to prevent infinite loops
  const isEncodingRef = useRef(false);
  const isDecodingRef = useRef(false);

  // Algorithm helper
  const algorithm = header?.alg || 'HS256';
  const isSymmetric = isSymmetricAlgorithm(algorithm);

  // Decode token when encoded token changes
  const handleTokenChange = useCallback((newToken) => {
    if (isEncodingRef.current) return;
    
    isDecodingRef.current = true;
    setEncodedToken(newToken);
    
    const decoded = decodeToken(newToken);
    
    if (decoded.error) {
      setParseError(decoded.error);
      setIsValid(null);
    } else {
      setParseError(null);
      setHeader(decoded.header);
      setPayload(decoded.payload);
    }
    
    // Reset validation when token changes
    setIsValid(null);
    setVerificationError(null);
    
    setTimeout(() => {
      isDecodingRef.current = false;
    }, 0);
  }, []);

  // Encode token when header/payload changes
  const encodeCurrentToken = useCallback(async () => {
    if (isDecodingRef.current) return;
    
    isEncodingRef.current = true;
    
    try {
      let result;
      
      if (isSymmetric) {
        if (secret) {
          result = await encodeTokenHS(header, payload, secret);
        } else {
          // Create unsigned token for display
          const unsigned = createUnsignedToken(header, payload);
          result = { token: unsigned, error: null };
        }
      } else {
        if (privateKey) {
          result = await encodeTokenRS(header, payload, privateKey);
        } else {
          // Create unsigned token for display
          const unsigned = createUnsignedToken(header, payload);
          result = { token: unsigned, error: null };
        }
      }
      
      if (result.token) {
        setEncodedToken(result.token);
        setParseError(null);
      } else if (result.error) {
        setParseError(result.error);
      }
    } catch (e) {
      setParseError(e.message);
    }
    
    setTimeout(() => {
      isEncodingRef.current = false;
    }, 0);
  }, [header, payload, secret, privateKey, isSymmetric]);

  // Verify signature
  const verifySignature = useCallback(async () => {
    if (!encodedToken) {
      setIsValid(null);
      setVerificationError(null);
      return;
    }

    try {
      let result;
      
      if (isSymmetric) {
        result = await verifyTokenHS(encodedToken, secret);
      } else {
        result = await verifyTokenRS(encodedToken, publicKey);
      }
      
      setIsValid(result.isValid);
      setVerificationError(result.isValid ? null : result.error);
    } catch (e) {
      setIsValid(false);
      setVerificationError(e.message);
    }
  }, [encodedToken, secret, publicKey, isSymmetric]);

  // Update header
  const updateHeader = useCallback((newHeader) => {
    if (typeof newHeader === 'string') {
      try {
        const parsed = JSON.parse(newHeader);
        setHeader(parsed);
      } catch {
        // Invalid JSON, don't update
      }
    } else {
      setHeader(newHeader);
    }
  }, []);

  // Update payload
  const updatePayload = useCallback((newPayload) => {
    if (typeof newPayload === 'string') {
      try {
        const parsed = JSON.parse(newPayload);
        setPayload(parsed);
      } catch {
        // Invalid JSON, don't update
      }
    } else {
      setPayload(newPayload);
    }
  }, []);

  // Update algorithm
  const updateAlgorithm = useCallback((newAlg) => {
    setHeader(prev => ({ ...prev, alg: newAlg }));
    setIsValid(null);
    setVerificationError(null);
  }, []);

  // Apply template
  const applyTemplate = useCallback((template) => {
    if (template?.header) {
      setHeader(template.header);
    }
    if (template?.payload) {
      setPayload(template.payload);
    }
    setIsValid(null);
    setVerificationError(null);
  }, []);

  // Reset to defaults
  const reset = useCallback(() => {
    setHeader(DEFAULT_HEADER);
    setPayload({
      ...DEFAULT_PAYLOAD,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    });
    setSecret(DEFAULT_SECRET);
    setPublicKey('');
    setPrivateKey('');
    setIsValid(null);
    setVerificationError(null);
    setParseError(null);
  }, []);

  // Initialize with sample token
  useEffect(() => {
    handleTokenChange(SAMPLE_TOKEN);
  }, []);

  // Re-encode when header/payload/keys change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      encodeCurrentToken();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [header, payload, secret, privateKey, encodeCurrentToken]);

  // Auto-verify when token or keys change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      verifySignature();
    }, 200);
    
    return () => clearTimeout(timeoutId);
  }, [encodedToken, secret, publicKey, verifySignature]);

  return {
    // State
    encodedToken,
    header,
    payload,
    secret,
    publicKey,
    privateKey,
    algorithm,
    isSymmetric,
    isValid,
    verificationError,
    parseError,
    
    // Actions
    setEncodedToken: handleTokenChange,
    setHeader: updateHeader,
    setPayload: updatePayload,
    setSecret,
    setPublicKey,
    setPrivateKey,
    setAlgorithm: updateAlgorithm,
    applyTemplate,
    verifySignature,
    reset
  };
};

export default useJwt;
