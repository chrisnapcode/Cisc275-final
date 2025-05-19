import React, { createContext, useContext, useState, useEffect } from 'react';

interface OpenAIContextValue {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const OpenAIContext = createContext<OpenAIContextValue | null>(null);

export const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('MYKEY') || ''
  );

  // persist to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) localStorage.setItem('MYKEY', apiKey);
  }, [apiKey]);

  return (
    <OpenAIContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </OpenAIContext.Provider>
  );
};

export const useOpenAI = () => {
  const ctx = useContext(OpenAIContext);
  if (!ctx) throw new Error('useOpenAI must be inside OpenAIProvider');
  return ctx;
};
