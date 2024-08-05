import MobileSidebar from "@/components/mobile-sidebar";
import Sidebar from "@/components/sidebar";
import { VolumeProvider } from "@/context/VolumeContext";
import { ReactNode } from "react";

const DashboardLayout = async ({
    children
}: {children :ReactNode}) => {

    return (  
        <div className="dashboard-layout__content relative bg-[#ffffff] min-h-full w-full">
            <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-0 bg-slate-900 md:w-72">
                <div>
                    <Sidebar />
                </div>
            </div>
            <main className="md:ml-72">
                <VolumeProvider>
                    <div className="md:hidden sm:sticky top-0 left-0">
                        <MobileSidebar />
                    </div>
                        {children}
                </VolumeProvider>
            </main>
        </div>
    );
}
 
export default DashboardLayout;