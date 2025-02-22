import React from 'react';

interface Transaction {
  amount: number;
  createdAt: string;
  object: {
    name: string;
  };
}

interface TableProps {
  transactions: Transaction[] | undefined;
}

const Table: React.FC<TableProps> = ({ transactions = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Project History
          </h4>
        </div>
        <span className="text-sm text-body dark:text-bodydark">
          {transactions?.length || 0} projects
        </span>
      </div>

      <div className="flex flex-col overflow-auto max-h-[400px] rounded-lg">
        <div className="grid grid-cols-3 bg-primary/5 dark:bg-primary/10 rounded-t-lg">
          <div className="p-4">
            <h5 className="text-sm font-medium text-black dark:text-white">
              Project
            </h5>
          </div>
          <div className="p-4 text-center">
            <h5 className="text-sm font-medium text-black dark:text-white">
              XP
            </h5>
          </div>
          <div className="p-4 text-center">
            <h5 className="text-sm font-medium text-black dark:text-white">
              Date
            </h5>
          </div>
        </div>

        <div className="divide-y divide-stroke dark:divide-strokedark">
          {transactions?.length > 0 ? transactions
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((transaction, key) => (
              <div
                key={key}
                className="grid grid-cols-3 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-black dark:text-white">
                    {transaction.object.name}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-success">
                    +{(transaction.amount / 1000).toFixed(1)}KB
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm text-body dark:text-bodydark">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-4 text-center text-sm text-body dark:text-bodydark">
                No projects completed yet
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Table;
