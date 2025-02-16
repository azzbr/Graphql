import React from 'react';

interface User {
  firstName: string;
  lastName: string;
  campus?: string;
  level?: number;
}

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white px-4 py-3 shadow-sm dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-medium text-black dark:text-white">
              Welcome, {user.firstName} {user.lastName}
            </h2>
            <div className="text-sm text-body dark:text-bodydark">
              {user.campus && <span>{user.campus} • </span>}
              {user.level && <span>Level {user.level}</span>}
            </div>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full border border-stroke bg-gray-100 dark:border-strokedark dark:bg-meta-4">
          <svg
            className="h-full w-full p-2 text-black dark:text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              fill="currentColor"
            />
            <path
              d="M12 14.5C6.99 14.5 3 17.44 3 21C3 21.55 3.45 22 4 22H20C20.55 22 21 21.55 21 21C21 17.44 17.01 14.5 12 14.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;