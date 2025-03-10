export const runtime = 'edge';

import SideBar from "@/components/SideBar";  
 
const Layout =   ({
    params,
    children,
  }: {
    params: { courseId: string   };
    children: any;
  }) => {
    return (
      <div className="relative flex min-h-screen">
        <SideBar courseId={params.courseId}/> 
        <div className="no-scrollbar grow overflow-y-auto p-2">{children}</div>
      </div>
    );
  };
  
  export default Layout;