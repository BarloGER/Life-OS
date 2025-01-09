import React from 'react';
import './assets/tresor-list.css';

type TresorListProps = {
  showTresorOverlay: boolean;
  setShowTresorOverlay: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TresorList: React.FC<TresorListProps> = ({
  showTresorOverlay,
  setShowTresorOverlay,
}) => {
  return (
    <div className="tresor-list">
      <button
        className="vaultOverview__overlay--closeBtn"
        onClick={() => setShowTresorOverlay(false)}
      >
        Close
      </button>
      <h1> Upcoming Feature </h1>
      <p>
        Accounts werden in Zukunft in unterschiedliche Vaults eingeteilt werden
        können
      </p>
    </div>
  );
};
