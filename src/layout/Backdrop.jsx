import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
  const {
    isMobileOpen,
    toggleMobileSidebar,
    isTablet,
    isExpanded,
    toggleSidebar,
  } = useSidebar();

  if (!isMobileOpen && !(isTablet && isExpanded)) return null;

  const handleClick = () => {
    if (isTablet) toggleSidebar();
    else toggleMobileSidebar();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
      onClick={handleClick}
    />
  );
};

export default Backdrop;
