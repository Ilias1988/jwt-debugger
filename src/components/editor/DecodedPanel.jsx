import React, { useState, useEffect } from 'react';
import { Code2, FileJson, AlertCircle } from 'lucide-react';
import DateDisplay from '../features/DateDisplay';

const JsonEditor = ({ value, onChange, label, color, icon: Icon }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  // Update text when value changes externally
  useEffect(() => {
    try {
      setText(JSON.stringify(value, null, 2));
      setError(null);
    } catch {
      // Keep current text if serialization fails
    }
  }, [value]);

  const handleChange = (newText) => {
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  // Find timestamp fields in the value
  const timestampFields = ['exp', 'iat', 'nbf', 'auth_time'];
  const timestamps = {};
  if (value && typeof value === 'object') {
    timestampFields.forEach(field => {
      if (typeof value[field] === 'number') {
        timestamps[field] = value[field];
      }
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b border-dark-600 ${color}`}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{error}</span>
          </div>
        )}
      </div>

      {/* JSON Editor */}
      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full h-full p-4 bg-transparent text-gray-200 font-mono text-sm resize-none focus:outline-none border-l-2 ${
            error ? 'border-red-500' : color.includes('pink') ? 'border-jwt-pink' : 'border-jwt-purple'
          }`}
          spellCheck="false"
        />
      </div>

      {/* Timestamp Displays */}
      {Object.keys(timestamps).length > 0 && (
        <div className="px-4 py-2 bg-dark-800/50 border-t border-dark-600 space-y-1">
          {Object.entries(timestamps).map(([field, value]) => (
            <DateDisplay key={field} fieldName={field} timestamp={value} />
          ))}
        </div>
      )}
    </div>
  );
};

const DecodedPanel = ({ header, payload, onHeaderChange, onPayloadChange }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600 bg-dark-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Decoded Token</h2>
          <span className="text-xs text-gray-500">Edit JSON to re-encode</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex-1 min-h-0 border-b border-dark-600">
        <JsonEditor
          value={header}
          onChange={onHeaderChange}
          label="HEADER"
          color="text-jwt-pink bg-jwt-pink/5"
          icon={Code2}
        />
      </div>

      {/* Payload Section */}
      <div className="flex-[2] min-h-0">
        <JsonEditor
          value={payload}
          onChange={onPayloadChange}
          label="PAYLOAD"
          color="text-jwt-purple bg-jwt-purple/5"
          icon={FileJson}
        />
      </div>
    </div>
  );
};

export default DecodedPanel;
