import React, { createContext, useContext, useState, useEffect } from 'react';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Peristence to simulate robust architecture
  useEffect(() => {
    const savedBranch = localStorage.getItem('otantik_branch');
    if (savedBranch) {
      setSelectedBranch(JSON.parse(savedBranch));
    }
    setIsInitializing(false);
  }, []);

  const selectBranch = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem('otantik_branch', JSON.stringify(branch));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const clearBranch = () => {
    setSelectedBranch(null);
    localStorage.removeItem('otantik_branch');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <BranchContext.Provider value={{ selectedBranch, selectBranch, clearBranch, isInitializing }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranch must be used within a BranchProvider');
  return context;
};
