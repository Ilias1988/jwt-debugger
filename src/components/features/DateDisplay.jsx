import React from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { formatTimestamp, getRelativeTime, getExpirationStatus, timestampFields } from '../../utils/dateUtils';

const DateDisplay = ({ fieldName, timestamp }) => {
  if (!timestamp || typeof timestamp !== 'number') {
    return null;
  }

  const formattedDate = formatTimestamp(timestamp);
  const relativeTime = getRelativeTime(timestamp);
  const fieldInfo = timestampFields[fieldName];
  
  // Special handling for 'exp' field
  const isExpField = fieldName === 'exp';
  const expirationStatus = isExpField ? getExpirationStatus(timestamp) : null;

  // Determine status styling
  const getStatusColor = () => {
    if (isExpField) {
      switch (expirationStatus?.status) {
        case 'expired': return 'text-red-400 bg-red-500/10 border-red-500/30';
        case 'expiring': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
        case 'valid': return 'text-green-400 bg-green-500/10 border-green-500/30';
        default: return 'text-gray-400 bg-dark-600 border-dark-500';
      }
    }
    if (relativeTime.isPast) {
      return 'text-gray-400 bg-dark-600 border-dark-500';
    }
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getStatusIcon = () => {
    if (isExpField) {
      switch (expirationStatus?.status) {
        case 'expired': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
        case 'expiring': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />;
        case 'valid': return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
        default: return <Clock className="w-3.5 h-3.5" />;
      }
    }
    return <Calendar className="w-3.5 h-3.5" />;
  };

  return (
    <div className={`mt-1 px-2 py-1.5 rounded border text-xs ${getStatusColor()}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{formattedDate}</span>
            {relativeTime.text && (
              <span className="opacity-75">({relativeTime.text})</span>
            )}
          </div>
          {fieldInfo && (
            <p className="text-xs opacity-60 mt-0.5">{fieldInfo.label}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact inline version for use within JSON display
export const InlineDateBadge = ({ fieldName, timestamp }) => {
  if (!timestamp || typeof timestamp !== 'number') {
    return null;
  }

  const relativeTime = getRelativeTime(timestamp);
  const isExpField = fieldName === 'exp';
  const expirationStatus = isExpField ? getExpirationStatus(timestamp) : null;

  const getBadgeColor = () => {
    if (isExpField) {
      switch (expirationStatus?.status) {
        case 'expired': return 'bg-red-500/20 text-red-400';
        case 'expiring': return 'bg-yellow-500/20 text-yellow-400';
        case 'valid': return 'bg-green-500/20 text-green-400';
        default: return 'bg-gray-500/20 text-gray-400';
      }
    }
    return 'bg-blue-500/20 text-blue-400';
  };

  const formattedDate = formatTimestamp(timestamp);

  return (
    <span className={`inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-xs ${getBadgeColor()}`}>
      <Clock className="w-3 h-3" />
      <span>{relativeTime.text || formattedDate}</span>
    </span>
  );
};

export default DateDisplay;
