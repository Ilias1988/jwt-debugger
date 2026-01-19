import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import EncodedPanel from './components/editor/EncodedPanel';
import DecodedPanel from './components/editor/DecodedPanel';
import SignatureSection from './components/editor/SignatureSection';
import useJwt from './hooks/useJwt';

function App() {
  const [isDark, setIsDark] = useState(true);
  
  const {
    encodedToken,
    header,
    payload,
    secret,
    publicKey,
    privateKey,
    algorithm,
    isValid,
    verificationError,
    parseError,
    setEncodedToken,
    setHeader,
    setPayload,
    setSecret,
    setPublicKey,
    setPrivateKey,
    setAlgorithm,
    applyTemplate,
    reset,
  } = useJwt();

  // Handle theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <Header
        onApplyTemplate={applyTemplate}
        onReset={reset}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Editor Panels */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Panel - Encoded Token */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-dark-600 bg-dark-900">
            <EncodedPanel
              token={encodedToken}
              onChange={setEncodedToken}
              parseError={parseError}
            />
          </div>

          {/* Right Panel - Decoded Token */}
          <div className="flex-1 min-h-[400px] lg:min-h-0 bg-dark-900">
            <DecodedPanel
              header={header}
              payload={payload}
              onHeaderChange={setHeader}
              onPayloadChange={setPayload}
            />
          </div>
        </div>

        {/* Signature Section */}
        <SignatureSection
          algorithm={algorithm}
          secret={secret}
          publicKey={publicKey}
          privateKey={privateKey}
          isValid={isValid}
          verificationError={verificationError}
          onAlgorithmChange={setAlgorithm}
          onSecretChange={setSecret}
          onPublicKeyChange={setPublicKey}
          onPrivateKeyChange={setPrivateKey}
        />
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-600 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            JWT Token Debugger & Generator — Built with React, Tailwind CSS, and jose
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🔐 100% Client-Side</span>
            <span>•</span>
            <span>No data is sent to any server</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
