import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // Close dropdown when pressing escape
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (keyCode === 27 && dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            John Doe
          </span>
          <span className="block text-xs">Admin</span>
        </span>

        <Image
          width={50}
          height={50}
          src="/images/user/male-avatar.svg"
          alt="User"
          className="h-12 w-12 rounded-full"
        />
      </button>

      {/* Dropdown Start */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
              >
                <path d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z" />
                <path d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8656 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z" />
              </svg>
              My Profile
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
              >
                <path d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.53749L17.8062 3.19687C17.1187 2.50937 15.9469 2.50937 15.2594 3.19687L15.1906 3.26562C15.0875 3.36874 14.9156 3.40312 14.7781 3.33437C14.6406 3.26562 14.5375 3.19687 14.4 3.16249C14.2625 3.09374 14.1594 2.95624 14.1594 2.78437V2.68124C14.1594 1.61562 13.2937 0.75 12.2281 0.75H10.3375C9.27187 0.75 8.40625 1.61562 8.40625 2.68124V2.78437C8.40625 2.95624 8.30312 3.09374 8.16562 3.16249C8.02812 3.23124 7.89062 3.29999 7.75312 3.36874C7.61562 3.43749 7.44375 3.40312 7.34062 3.29999L7.27187 3.23124C6.58437 2.54374 5.4125 2.54374 4.725 3.23124L3.38437 4.57187C3.00625 4.91562 2.79999 5.39687 2.79999 5.91249C2.79999 6.42812 2.97187 6.90937 3.34999 7.25312L3.41874 7.32187C3.52187 7.42499 3.55624 7.59687 3.48749 7.73437C3.41874 7.87187 3.34999 8.00937 3.31562 8.14687C3.24687 8.28437 3.10937 8.38749 2.9375 8.38749H2.83437C2.31875 8.38749 1.83749 8.59374 1.49374 8.97187C1.15 9.34999 0.943744 9.83124 0.943744 10.3469V12.2375C0.943744 13.3031 1.81037 14.1687 2.87499 14.1687H2.97812C3.15 14.1687 3.28749 14.2719 3.35624 14.4094" />
              </svg>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownUser;
