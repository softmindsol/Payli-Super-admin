import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ModalProvider } from "../context/modal/index"; // + modal provider
import ModalRoot from "../components/Modals"; // + modal root overlay

import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import ErrorBoundary from "../components/ErrorBoundary";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen, isTablet } = useSidebar();

  return (
    <div className="min-h-screen xl:flex overflow-x-hidden">
      <div>
        <ErrorBoundary>
          <AppSidebar />
        </ErrorBoundary>
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${
          isExpanded || isHovered
            ? "lg:ml-[290px] xl:ml-[290px]"
            : "lg:ml-[90px] xl:ml-[90px]"
        } ${
          isTablet && (isExpanded || isHovered)
            ? "md:ml-[290px]"
            : isTablet
            ? "md:ml-[90px]"
            : ""
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
