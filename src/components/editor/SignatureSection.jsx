import React, { useState } from 'react';
import { Key, Lock, Unlock, CheckCircle, XCircle, Eye, EyeOff, RefreshCw, ChevronDown } from 'lucide-react';
import SecretStrengthMeter from '../features/SecretStrengthMeter';
import { ALGORITHMS, isSymmetricAlgorithm, generateKeyPair } from '../../utils/jwtUtils';

const SignatureSection = ({
  algorithm,
  secret,
  publicKey,
  privateKey,
  isValid,
  verificationError,
  onAlgorithmChange,
  onSecretChange,
  onPublicKeyChange,
  onPrivateKeyChange,
}) => {
  const [showSecret, setShowSecret] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAlgorithmDropdown, setShowAlgorithmDropdown] = useState(false);

  const isSymmetric = isSymmetricAlgorithm(algorithm);
  const algorithmInfo = ALGORITHMS[algorithm];

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const result = await generateKeyPair(algorithm);
      if (result.publicKey && result.privateKey) {
        onPublicKeyChange(result.publicKey);
        onPrivateKeyChange(result.privateKey);
      }
    } catch (error) {
      console.error('Failed to generate keys:', error);
    }
    setIsGenerating(false);
  };

  const getValidationStatus = () => {
    if (isValid === null) {
      return {
        color: 'text-gray-400 bg-dark-700 border-dark-600',
        icon: <Key className="w-5 h-5" />,
        text: 'Enter secret to verify',
      };
    }
    if (isValid) {
      return {
        color: 'text-green-400 bg-green-500/10 border-green-500/30',
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        text: 'Signature Verified',
      };
    }
    return {
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      text: 'Invalid Signature',
    };
  };

  const status = getValidationStatus();

  // Group algorithms by type
  const symmetricAlgs = Object.values(ALGORITHMS).filter(a => a.type === 'symmetric');
  const asymmetricAlgs = Object.values(ALGORITHMS).filter(a => a.type === 'asymmetric');

  return (
    <div className="bg-dark-800 border-t border-dark-600">
      {/* Validation Status Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${status.color}`}>
        <div className="flex items-center gap-3">
          {status.icon}
          <div>
            <p className="text-sm font-medium">{status.text}</p>
            {verificationError && (
              <p className="text-xs opacity-75 mt-0.5">{verificationError}</p>
            )}
          </div>
        </div>
        
        {/* Algorithm Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAlgorithmDropdown(!showAlgorithmDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-lg text-sm text-white transition-colors"
          >
            <span className="font-mono font-medium">{algorithm}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAlgorithmDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showAlgorithmDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-dark-600">
                <p className="text-xs text-gray-400 uppercase tracking-wider px-2">Symmetric (HMAC)</p>
              </div>
              <div className="p-1">
                {symmetricAlgs.map((alg) => (
                  <button
                    key={alg.name}
                    onClick={() => {
                      onAlgorithmChange(alg.name);
                      setShowAlgorithmDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-dark-600 text-left ${
                      algorithm === alg.name ? 'bg-dark-600' : ''
                    }`}
                  >
                    <div>
                      <span className="font-mono text-sm text-white">{alg.name}</span>
                      <p className="text-xs text-gray-400">{alg.description}</p>
                    </div>
                    {algorithm === alg.name && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-dark-600">
                <p className="text-xs text-gray-400 uppercase tracking-wider px-2">Asymmetric (RSA/ECDSA)</p>
              </div>
              <div className="p-1">
                {asymmetricAlgs.map((alg) => (
                  <button
                    key={alg.name}
                    onClick={() => {
                      onAlgorithmChange(alg.name);
                      setShowAlgorithmDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-dark-600 text-left ${
                      algorithm === alg.name ? 'bg-dark-600' : ''
                    }`}
                  >
                    <div>
                      <span className="font-mono text-sm text-white">{alg.name}</span>
                      <p className="text-xs text-gray-400">{alg.description}</p>
                    </div>
                    {algorithm === alg.name && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Input Section */}
      <div className="p-4">
        {isSymmetric ? (
          /* Symmetric Key Input */
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <Lock className="w-4 h-4" />
              Secret Key
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={secret}
                onChange={(e) => onSecretChange(e.target.value)}
                placeholder="Enter your secret key..."
                className="w-full px-4 py-3 pr-12 bg-dark-700 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-jwt-cyan transition-colors"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <SecretStrengthMeter secret={secret} />
          </div>
        ) : (
          /* Asymmetric Key Inputs */
          <div className="space-y-4">
            {/* Generate Button */}
            <button
              onClick={handleGenerateKeys}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-jwt-purple/20 hover:bg-jwt-purple/30 text-jwt-purple border border-jwt-purple/30 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate Key Pair
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Public Key */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Unlock className="w-4 h-4 text-green-400" />
                  Public Key (for verification)
                </label>
                <textarea
                  value={publicKey}
                  onChange={(e) => onPublicKeyChange(e.target.value)}
                  placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
                  className="w-full h-32 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-green-500 transition-colors"
                  spellCheck="false"
                />
              </div>

              {/* Private Key */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  Private Key (for signing)
                </label>
                <textarea
                  value={privateKey}
                  onChange={(e) => onPrivateKeyChange(e.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                  className="w-full h-32 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-red-500 transition-colors"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="mt-4 p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <div className="flex items-center gap-2 text-sm">
            <Key className="w-4 h-4 text-jwt-cyan" />
            <span className="text-gray-300">
              <strong className="text-white">{algorithm}</strong> — {algorithmInfo?.description}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isSymmetric 
              ? 'Uses a shared secret key for both signing and verification.'
              : 'Uses a public/private key pair. Sign with private key, verify with public key.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
