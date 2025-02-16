import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BreadCrumbs = () => {
  const pathname = usePathname();
  const pathNames = pathname?.split('/').filter((path) => path);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pathNames ? pathNames[pathNames.length - 1]?.charAt(0).toUpperCase() + 
                    pathNames[pathNames.length - 1]?.slice(1) : 'Dashboard'}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Home
            </Link>
          </li>
          {pathNames?.map((path, index) => {
            const href = `/${pathNames.slice(0, index + 1).join('/')}`;
            const itemText = path.charAt(0).toUpperCase() + path.slice(1);
            const isLast = index === pathNames.length - 1;

            return (
              <li key={path} className="flex items-center gap-2">
                <span>/</span>
                {isLast ? (
                  <span className="text-primary">{itemText}</span>
                ) : (
                  <Link className="font-medium" href={href}>
                    {itemText}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default BreadCrumbs;