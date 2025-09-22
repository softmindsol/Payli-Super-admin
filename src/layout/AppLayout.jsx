import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ModalProvider } from "../context/modal/index"; // + modal provider
import ModalRoot from "../components/Modals"; // + modal root overlay

import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-[var(--breakpoint-2xl)] md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <ModalProvider>
        <LayoutContent />
        {/* keep a single modal root at app level */}
        <ModalRoot />
      </ModalProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
