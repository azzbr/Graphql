import React from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rateUp?: string;
  rateDown?: string;
  info?: string[];
  children: React.ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rateUp,
  rateDown,
  info,
  children,
}) => {
  return (
    <div className="card card-gradient">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/30 transition-transform duration-300 hover:scale-110">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="stats-value mb-2">{total}</h4>
          <span className="stats-label">{title}</span>
          {info && info.length > 0 && (
            <div className="mt-3 space-y-1">
              {info.map((item, index) => (
                <div 
                  key={index} 
                  className="text-xs font-medium text-primary/80 dark:text-primary/70"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {(rateUp || rateDown) && (
          <div className="flex flex-col items-end gap-2">
            {rateUp && (
              <div className="flex items-center gap-1 text-success">
                <svg
                  className="fill-current"
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  />
                </svg>
                <span className="text-sm font-medium">{rateUp}</span>
              </div>
            )}
            {rateDown && (
              <div className="flex items-center gap-1 text-danger">
                <svg
                  className="fill-current"
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848689L5.64284 0.0848689L5.64284 7.69237Z"
                  />
                </svg>
                <span className="text-sm font-medium">{rateDown}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDataStats;
