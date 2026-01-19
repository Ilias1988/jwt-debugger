import React, { useState } from 'react';
import { Copy, Check, ClipboardPaste, Trash2 } from 'lucide-react';
import { getTokenParts } from '../../utils/jwtUtils';

const EncodedPanel = ({ token, onChange, parseError }) => {
  const [copied, setCopied] = useState(false);
  const parts = getTokenParts(token);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text.trim());
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  // Render color-coded token
  const renderColoredToken = () => {
    if (!token) return null;

    return (
      <div className="font-mono text-sm break-all leading-relaxed">
        <span className="token-header">{parts.header}</span>
        {parts.header && <span className="text-gray-500">.</span>}
        <span className="token-payload">{parts.payload}</span>
        {parts.payload && <span className="text-gray-500">.</span>}
        <span className="token-signature">{parts.signature}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600 bg-dark-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Encoded Token</h2>
          <span className="text-xs text-gray-500">
            {token ? `${token.length} characters` : 'Paste your JWT'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePaste}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-600 rounded transition-colors"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            disabled={!token}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={!token}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear token"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-dark-800/50 border-b border-dark-600 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-jwt-pink"></span>
          <span className="text-gray-400">Header</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-jwt-purple"></span>
          <span className="text-gray-400">Payload</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-jwt-cyan"></span>
          <span className="text-gray-400">Signature</span>
        </div>
      </div>

      {/* Token Display / Input */}
      <div className="flex-1 relative">
        {/* Color-coded preview overlay */}
        <div className="absolute inset-0 p-4 pointer-events-none overflow-auto">
          {renderColoredToken()}
        </div>
        
        {/* Actual textarea (invisible but interactive) */}
        <textarea
          value={token}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-jwt-pink/50"
          spellCheck="false"
        />
      </div>

      {/* Error Display */}
      {parseError && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
          <p className="text-xs text-red-400">⚠️ {parseError}</p>
        </div>
      )}

      {/* Token Info Footer */}
      {token && !parseError && (
        <div className="px-4 py-2 bg-dark-800/50 border-t border-dark-600">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Header: {parts.header.length} chars</span>
            <span>Payload: {parts.payload.length} chars</span>
            <span>Signature: {parts.signature.length} chars</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncodedPanel;
