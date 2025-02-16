import Link from 'next/link';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownUser from './DropdownUser';

const Header = () => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="block flex-shrink-0">
            <img src="/images/logo.svg" alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Switcher */}
            <DarkModeSwitcher />
          </ul>

          {/* User Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;