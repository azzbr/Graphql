import React from 'react';

interface LevelCardProps {
  level?: number;
  nextLevelXp?: number;
  currentRank?: string;
  levelsToNextRank?: number;
  children: React.ReactNode;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level = 0,
  nextLevelXp = 0,
  currentRank = 'Loading...',
  levelsToNextRank = 0,
  children,
}) => {
  return (
    <div className="card card-gradient">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/30">
          {children}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-body dark:text-bodydark">Current rank</span>
          <span className="font-medium text-black dark:text-white">{currentRank}</span>
          <span className="text-sm text-body dark:text-bodydark">Next rank in {levelsToNextRank} levels</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-black dark:text-white">Level</span>
          <span className="text-2xl font-bold text-black dark:text-white">{level}</span>
        </div>
        <span className="text-sm text-body dark:text-bodydark">
          Next level in {nextLevelXp} kB
        </span>
      </div>
    </div>
  );
};

export default LevelCard;
