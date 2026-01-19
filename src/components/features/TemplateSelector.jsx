import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileCode, Check } from 'lucide-react';
import { getTemplateList, getTemplate } from '../../utils/templates';

const TemplateSelector = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dropdownRef = useRef(null);
  
  const templates = getTemplateList();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (templateKey) => {
    const template = getTemplate(templateKey);
    if (template && onSelect) {
      onSelect(template);
      setSelectedTemplate(templateKey);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors border border-dark-600"
      >
        <FileCode className="w-4 h-4" />
        <span className="hidden sm:inline">Templates</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-dark-600">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Payload Templates</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {templates.map((template) => (
              <button
                key={template.key}
                onClick={() => handleSelect(template.key)}
                className={`w-full text-left px-3 py-2.5 hover:bg-dark-600 transition-colors flex items-center justify-between group ${
                  selectedTemplate === template.key ? 'bg-dark-600' : ''
                }`}
              >
                <div>
                  <p className="text-sm text-white font-medium">{template.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{template.description}</p>
                </div>
                {selectedTemplate === template.key && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-dark-600 bg-dark-800/50">
            <p className="text-xs text-gray-500">
              Select a template to auto-fill the payload with common JWT formats.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
