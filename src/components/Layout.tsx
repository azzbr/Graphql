import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Content Area Start ===== --> */}
      <div className="w-full">
        {/* <!-- ===== Main Content Start ===== --> */}
        <main className="overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
        {/* <!-- ===== Main Content End ===== --> */}
      </div>
      {/* <!-- ===== Content Area End ===== --> */}
    </div>
  );
};

export default Layout;
