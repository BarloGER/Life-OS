import React, { ReactNode } from 'react';
import './assets/vault-overview-template.css';

interface Props {
  children: ReactNode;
}

export const VaultOverviewTemplate: React.FC<Props> = ({ children }) => {
  return <div className="vault-overview__grid">{children}</div>;
};
