import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

const DashboardLayout = async ({
    children
}: {children :ReactNode}) => {

    return (  
        <div className="dashboard-layout__content relative bg-[#ffffff] min-h-full">
            <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[50] bg-slate-900 md:w-72">
                <div>
                    <Sidebar />
                </div>
            </div>
            <main className="md:pl-72">
                {children}
            </main>
        </div>
    );
}
 
export default DashboardLayout;