import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { MoreVertical, LogOut } from "lucide-react"; // Import this

// ---- bring data/icons/logo from your other file ----
import { UsersRound } from "lucide-react";
import { MdOutlineDashboard } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import { AiOutlineCreditCard } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";
import { IoCubeOutline } from "react-icons/io5";
import { Logo } from "../assets/svgs"; // your Payli logo svg
import { useGetMeQuery } from "../features/api/apiSlice";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// Original "items" config (you can keep it in a separate file too)
const items = [
  // Temporarily commenting out Dashboard and Inventory as requested
  // { title: "Dashboard", url: "/dashboard", icon: MdOutlineDashboard },
  // { title: "Inventory", url: "/inventory", icon: GrCart },
  { title: "Clients", url: "/clients", icon: UsersRound },
];

const AppSidebar = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    isTablet,
    isMobile,
  } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // (Optional) if later you add submenus, these handle smooth expand/collapse
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // Normalize items -> navItems matching previous component shape
  const navItems = useMemo(
    () =>
      items.map((it) => ({
        name: it.title,
        path: it.url,
        IconCmp: it.icon,
        // subItems: [] // keep for future
      })),
    []
  );

  const isActive = useCallback(
    (path) => path && location && location.pathname === path,
    [location]
  );

  useEffect(() => {
    // auto-open submenu when route matches a child (for future subItems)
    let matched = false;
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenSubmenu({ type: "main", index });
          matched = true;
        }
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `main-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { type: "main", index }
    );
  };

  const isExternal = (url = "") => /^https?:\/\//i.test(url);

  const renderMenuItems = () => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => {
        const active = isActive(nav.path);
        const hasSub = !!nav.subItems?.length;

        const IconComponent = nav.IconCmp;

        return (
          <li key={nav.name}>
            {hasSub ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-md transition
                  ${
                    openSubmenu?.index === index
                      ? "bg-white text-[#0A285E] shadow"
                      : "text-white/95 hover:bg-white/10"
                  }
                  ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
              >
                {IconComponent && (
                  <IconComponent
                    className={`${
                      openSubmenu?.index === index
                        ? "text-[#0A285E]"
                        : "text-white"
                    } w-5 h-5`}
                  />
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm font-medium">{nav.name}</span>
                )}
              </button>
            ) : nav.path ? (
              isExternal(nav.path) ? (
                <a
                  href={nav.path}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-3 px-4 py-3 rounded-md transition
                    ${
                      active
                        ? "bg-white text-[#0A285E] shadow"
                        : "text-white/95 hover:bg-white/10"
                    }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`${
                        active ? "text-[#0A285E]" : "text-white"
                      } w-5 h-5`}
                    />
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm font-medium">{nav.name}</span>
                  )}
                </a>
              ) : (
                <Link
                  to={nav.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-md transition
                    ${
                      active
                        ? "bg-white text-[#0A285E] shadow"
                        : "text-white/95 hover:bg-white/10"
                    }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`${
                        active ? "text-[#0A285E]" : "text-white"
                      } w-5 h-5`}
                    />
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm font-medium">{nav.name}</span>
                  )}
                </Link>
              )
            ) : null}

            {/* Submenu (ready for future) */}
            {hasSub && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`main-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`main-${index}`] || 0}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 ml-10 space-y-1">
                  {nav.subItems.map((sub) => {
                    const subActive = isActive(sub.path);
                    return (
                      <li key={sub.name}>
                        <Link
                          to={sub.path}
                          className={`flex items-center text-sm px-3 py-2 rounded-md
                            ${
                              subActive
                                ? "bg-white/95 text-[#0A285E]"
                                : "text-white/90 hover:bg-white/10"
                            }`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0
        bg-gradient-to-b from-[#1D50AB] to-[#0A285E] text-white
        h-screen transition-all duration-300 ease-in-out z-50 border-r border-white/10
        ${isExpanded || isHovered ? "w-[290px]" : "w-[90px]"}
        ${
          isMobileOpen || (isTablet && isExpanded)
            ? "translate-x-0"
            : isTablet || isMobile
            ? "-translate-x-full"
            : "translate-x-0"
        }
        lg:translate-x-0`}
      onMouseEnter={() =>
        !isExpanded && !isTablet && !isMobile && setIsHovered(true)
      }
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
        <Link to="/">
          <img className="max-w-[126px] w-full" src={Logo} alt="Payli-Logo" />
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-white/80
              ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              "Main Menu"
            ) : (
              <IoCubeOutline className="size-6" />
            )}
          </h2>
          {renderMenuItems()}
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
      {/* Bottom area (non-scroll) */}
      <div className="pt-3 pb-5">
        {(isExpanded || isHovered || isMobileOpen) && (
          <>
            {/* <div className="flex items-center gap-2 mb-3 text-white/90">
              <Info className="w-4 h-4" />
              <span className="font-medium">Customer Support</span>
            </div> */}
            <div className="h-px mb-3 bg-white/20" />
          </>
        )}
        {/* Profile Section (added at the bottom) */}
        <div className=" pt-5 pb-3">
          <div className="flex items-center gap-2">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gray-400 rounded-full overflow-hidden">
              {userData?.data?.profilePic ? (
                <img
                  src={`${import.meta.env.VITE_S3_BASE_URL}${
                    userData.data.profilePic
                  }`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm">
                  {userData?.data?.firstName?.[0] || "U"}
                </div>
              )}
            </div>

            {/* User Name */}
            <div className="flex-1 min-w-0">
              <div className="truncate text-[14px] font-semibold text-white">
                {userLoading ? "Loading..." : userData?.data?.name || "User"}
              </div>
              <div className="truncate text-[11px] text-white/75">
                {userData?.data?.role || "Admin"}
              </div>
            </div>

            {/* More options (click to toggle menu) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-white/10 focus:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={false}
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-48 bg-white border-gray-200 text-gray-900 z-[9999]"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
