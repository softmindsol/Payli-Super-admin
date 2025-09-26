import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import LanguageToggle from "@/components/LanguageToggle";
import LocationSelector from "@/components/LocationSelector";
// import { LanguageToggle, LocationSelector } from "@/components";
// import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
// import NotificationDropdown from "../components/header/NotificationDropdown";
// import UserDropdown from "../components/header/UserDropdown";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  const toggleApplicationMenu = () => setApplicationMenuOpen((v) => !v);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className="
        sticky top-0 z-[1000]   /* real z-index so it stays above content */
        bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80
        border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800
        shadow-sm
      "
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* top row */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="items-center justify-center hidden text-gray-500 border border-gray-200 rounded-lg lg:flex h-11 w-11 dark:border-gray-800 dark:text-gray-400"
          >
            {/* hamburger / close */}
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131c-.29289-.2929-.29289-.76777 0-1.06066.29289-.2929.76777-.2929 1.06066 0L12 10.9393l4.7186-4.71852c.2928-.29289.7677-.2929 1.0605 0 .2929.29289.2929.76777 0 1.06066L13.0597 12l4.7191 4.7186c.2929.2929.2929.7677 0 1.0606-.2928.2929-.7677.2929-1.0605 0L12 13.0607l-4.71967 4.7187c-.29289.2928-.76777.2928-1.06066 0-.29289-.2929-.29289-.7678 0-1.0607L10.9384 12 6.21967 7.28131z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M.583 1A.75.75 0 0 1 1.333.25h13.333a.75.75 0 1 1 0 1.5H1.333A.75.75 0 0 1 .583 1Zm0 10a.75.75 0 0 1 .75-.75h13.333a.75.75 0 1 1 0 1.5H1.333A.75.75 0 0 1 .583 11ZM1.333 5.25a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5H1.333Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden w-28"
              src="./images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link> */}

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Open quick actions"
          >
            {/* dots icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.495c.828 0 1.5.672 1.5 1.5s-.672 1.51-1.5 1.51a1.505 1.505 0 0 1 0-3.01Zm12 0c.829 0 1.5.672 1.5 1.5s-.671 1.51-1.5 1.51a1.505 1.505 0 0 1 0-3.01ZM13.5 12c0-.828-.672-1.5-1.5-1.5S10.5 11.172 10.5 12s.672 1.505 1.5 1.505S13.5 12.828 13.5 12Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* search */}
          {/* <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.042 9.374A6.333 6.333 0 1 1 15.708 9.374 6.333 6.333 0 0 1 3.042 9.374Zm6.333-7.832A7.832 7.832 0 1 0 17.208 9.374 7.832 7.832 0 0 0 9.375 1.542Zm4.982 13.876 2.82 2.82a.5.5 0 1 0 .707-.707l-2.82-2.82a7.792 7.792 0 0 0-1.414.707Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white/70 py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/10 dark:text-white/90 dark:placeholder:text-white/30 xl:w-[430px]"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/10 dark:text-gray-400">
                  ⌘ K
                </span>
              </div>
            </form>
          </div> */}
        </div>

        {/* right actions */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } w-full items-center justify-between gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <ThemeToggleButton /> */}
            {/* <NotificationDropdown /> */}
            <LocationSelector />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
