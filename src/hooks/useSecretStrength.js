import { useMemo } from 'react';

/**
 * Hook to calculate password/secret strength
 * @param {string} secret - The secret string to evaluate
 * @returns {object} { score, level, feedback, color, percentage }
 */
export const useSecretStrength = (secret) => {
  return useMemo(() => {
    if (!secret || secret.length === 0) {
      return {
        score: 0,
        level: 'none',
        feedback: 'Enter a secret key',
        color: 'gray',
        percentage: 0,
        details: []
      };
    }

    let score = 0;
    const details = [];

    // Length checks
    if (secret.length >= 8) {
      score += 1;
      details.push({ check: 'At least 8 characters', passed: true });
    } else {
      details.push({ check: 'At least 8 characters', passed: false });
    }

    if (secret.length >= 16) {
      score += 1;
      details.push({ check: 'At least 16 characters', passed: true });
    } else {
      details.push({ check: 'At least 16 characters', passed: false });
    }

    if (secret.length >= 32) {
      score += 1;
      details.push({ check: 'At least 32 characters (recommended)', passed: true });
    } else {
      details.push({ check: 'At least 32 characters (recommended)', passed: false });
    }

    // Character variety checks
    if (/[a-z]/.test(secret)) {
      score += 0.5;
      details.push({ check: 'Contains lowercase letters', passed: true });
    } else {
      details.push({ check: 'Contains lowercase letters', passed: false });
    }

    if (/[A-Z]/.test(secret)) {
      score += 0.5;
      details.push({ check: 'Contains uppercase letters', passed: true });
    } else {
      details.push({ check: 'Contains uppercase letters', passed: false });
    }

    if (/[0-9]/.test(secret)) {
      score += 0.5;
      details.push({ check: 'Contains numbers', passed: true });
    } else {
      details.push({ check: 'Contains numbers', passed: false });
    }

    if (/[^A-Za-z0-9]/.test(secret)) {
      score += 0.5;
      details.push({ check: 'Contains special characters', passed: true });
    } else {
      details.push({ check: 'Contains special characters', passed: false });
    }

    // Bonus for high entropy
    const uniqueChars = new Set(secret).size;
    if (uniqueChars >= 10) {
      score += 0.5;
    }
    if (uniqueChars >= 20) {
      score += 0.5;
    }

    // Penalty for common patterns
    const commonPatterns = [
      'password', 'secret', '123456', 'qwerty', 'admin',
      'your-256-bit-secret', 'your-secret-key'
    ];
    
    const lowerSecret = secret.toLowerCase();
    for (const pattern of commonPatterns) {
      if (lowerSecret.includes(pattern)) {
        score -= 2;
        details.push({ check: `Avoid common patterns like "${pattern}"`, passed: false, warning: true });
        break;
      }
    }

    // Normalize score
    const normalizedScore = Math.max(0, Math.min(6, score));
    const percentage = Math.round((normalizedScore / 6) * 100);

    // Determine level and feedback
    let level, feedback, color;

    if (normalizedScore < 2) {
      level = 'weak';
      feedback = 'Weak - Use a longer, more complex secret';
      color = 'red';
    } else if (normalizedScore < 4) {
      level = 'medium';
      feedback = 'Medium - Consider adding more complexity';
      color = 'yellow';
    } else {
      level = 'strong';
      feedback = 'Strong - Good secret strength';
      color = 'green';
    }

    // Check for minimum recommended length for JWT
    if (secret.length < 32) {
      feedback += ' (32+ chars recommended for HS256)';
    }

    return {
      score: normalizedScore,
      level,
      feedback,
      color,
      percentage,
      details
    };
  }, [secret]);
};

export default useSecretStrength;
