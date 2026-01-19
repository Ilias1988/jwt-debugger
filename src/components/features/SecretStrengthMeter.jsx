import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Check, X, AlertTriangle } from 'lucide-react';
import useSecretStrength from '../../hooks/useSecretStrength';

const SecretStrengthMeter = ({ secret }) => {
  const [showDetails, setShowDetails] = useState(false);
  const strength = useSecretStrength(secret);

  const getBarColor = () => {
    switch (strength.level) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  const getTextColor = () => {
    switch (strength.level) {
      case 'weak': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'strong': return 'text-green-400';
      default: return 'text-gray-500';
    }
  };

  const getIcon = () => {
    switch (strength.level) {
      case 'weak': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Shield className="w-4 h-4 text-yellow-400" />;
      case 'strong': return <Shield className="w-4 h-4 text-green-400" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!secret) {
    return null;
  }

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        {getIcon()}
        <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between mt-1">
        <span className={`text-xs font-medium ${getTextColor()}`}>
          {strength.feedback}
        </span>
        <span className="text-xs text-gray-500">
          {secret.length} characters
        </span>
      </div>

      {/* Detailed Checks */}
      {showDetails && strength.details.length > 0 && (
        <div className="mt-3 p-3 bg-dark-700 rounded-lg border border-dark-600">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Security Checks</p>
          <div className="space-y-1.5">
            {strength.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {detail.passed ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : detail.warning ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-500" />
                )}
                <span className={detail.passed ? 'text-gray-300' : detail.warning ? 'text-red-400' : 'text-gray-500'}>
                  {detail.check}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-dark-600">
            <p className="text-xs text-gray-500">
              💡 For HS256, use a secret key of at least 32 characters for optimal security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretStrengthMeter;
