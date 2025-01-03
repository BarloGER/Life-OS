import { createContext, useState, useEffect } from 'react';

export const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [design, setDesign] = useState(
    localStorage.getItem('currentDesign') || 'design1'
  );

  useEffect(() => {
    const root = document.documentElement;

    const designClasses = {
      design1: 'theme-design1',
      design2: 'theme-design2',
    };

    // Remove all possible design classes before adding the new one
    Object.values(designClasses).forEach((designClass) => {
      root.classList.remove(designClass);
    });

    // Add the new design class based on the current design
    const selectedClass = designClasses[design];
    if (selectedClass) {
      root.classList.add(selectedClass);
    }
  }, [design]);

  const changeDesign = (newDesign) => {
    setDesign(newDesign);
    localStorage.setItem('currentDesign', newDesign);
  };

  return (
    <DesignContext.Provider value={{ design, changeDesign }}>
      {children}
    </DesignContext.Provider>
  );
};
