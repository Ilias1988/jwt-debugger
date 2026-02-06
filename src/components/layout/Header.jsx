import React from 'react';
import { Shield, Github, RotateCcw, Moon, Sun, Linkedin } from 'lucide-react';
import TemplateSelector from '../features/TemplateSelector';

// X (Twitter) Icon Component
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Header = ({ onApplyTemplate, onReset, isDark, onToggleTheme }) => {
  return (
    <header className="bg-dark-800 border-b border-dark-600 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-jwt-pink to-jwt-purple">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">JWT Debugger</h1>
            <p className="text-xs text-gray-400">Token Debugger & Generator</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Template Selector */}
          <TemplateSelector onSelect={onApplyTemplate} />
          
          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Social Media Links */}
          <a
            href="https://github.com/Ilias1988"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            href="https://x.com/EliotGeo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            title="X (Twitter)"
          >
            <XIcon className="w-5 h-5" />
          </a>

          <a
            href="https://www.linkedin.com/in/ilias-georgopoulos-b491a3371/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-7xl mx-auto mt-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-dark-700/50 border border-dark-600 rounded-lg text-xs text-gray-400">
          <Shield className="w-4 h-4 text-green-500" />
          <span>
            <strong className="text-green-500">100% Client-Side</strong> — All processing happens in your browser. No data is sent to any server.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
