// Date utility functions for JWT timestamp handling

/**
 * Format a Unix timestamp to human-readable date
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp || typeof timestamp !== 'number') return null;
  
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch {
    return null;
  }
};

/**
 * Get relative time description (e.g., "in 2 hours", "5 days ago")
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {object} { text: string, isExpired: boolean, isPast: boolean }
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp || typeof timestamp !== 'number') {
    return { text: null, isExpired: false, isPast: false };
  }

  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;
  const isExpired = isPast;

  // Define time units
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 }
  ];

  for (const unit of units) {
    if (absDiff >= unit.seconds) {
      const value = Math.floor(absDiff / unit.seconds);
      const unitName = value === 1 ? unit.name : `${unit.name}s`;
      const text = isPast ? `${value} ${unitName} ago` : `in ${value} ${unitName}`;
      return { text, isExpired, isPast };
    }
  }

  return { text: 'just now', isExpired: false, isPast: false };
};

/**
 * Check if a timestamp claim exists and is a valid number
 * @param {any} value - The value to check
 * @returns {boolean}
 */
export const isValidTimestamp = (value) => {
  return typeof value === 'number' && value > 0 && value < 4102444800; // Before year 2100
};

/**
 * Get expiration status for display
 * @param {number} exp - Expiration timestamp
 * @returns {object} { status: 'valid' | 'expiring' | 'expired', message: string }
 */
export const getExpirationStatus = (exp) => {
  if (!isValidTimestamp(exp)) {
    return { status: 'unknown', message: 'No expiration set' };
  }

  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;

  if (diff < 0) {
    return { status: 'expired', message: 'Token has expired' };
  }

  // Warning if expiring within 1 hour
  if (diff < 3600) {
    return { status: 'expiring', message: 'Token expiring soon' };
  }

  return { status: 'valid', message: 'Token is valid' };
};

/**
 * Format duration between two timestamps
 * @param {number} start - Start timestamp
 * @param {number} end - End timestamp
 * @returns {string} Duration string
 */
export const formatDuration = (start, end) => {
  if (!isValidTimestamp(start) || !isValidTimestamp(end)) return null;
  
  const diff = Math.abs(end - start);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

/**
 * Timestamp field labels and descriptions
 */
export const timestampFields = {
  exp: {
    label: 'Expiration Time',
    description: 'Time after which the JWT must not be accepted'
  },
  iat: {
    label: 'Issued At',
    description: 'Time at which the JWT was issued'
  },
  nbf: {
    label: 'Not Before',
    description: 'Time before which the JWT must not be accepted'
  },
  auth_time: {
    label: 'Authentication Time',
    description: 'Time when the authentication occurred'
  }
};
