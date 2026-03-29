"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { AuthRoleName } from "@repo/core";
import {
  LayoutDashboard,
  UserCog,
  Building2,
  Users,
  BadgeDollarSign,
  Gem,
  Briefcase,
  BarChart3,
  Layers,
  Shield,
  ChevronDown,
  MoreHorizontal,
  Receipt,
  Hourglass,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    new?: boolean;
    roles?: AuthRoleName[];
  }[];
  roles?: AuthRoleName[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <BadgeDollarSign size={20} />,
    name: "Pricelist",
    path: "/pricelist",
  },
  {
    icon: <Shield size={20} />,
    name: "Persetujuan Katalog",
    path: "/approval",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    icon: <Receipt size={20} />,
    name: "Riwayat Transaksi",
    path: "/transaction/history",
  },
  {
    icon: <Hourglass size={20} />,
    name: "Menunggu Pembayaran",
    path: "/transaction/approval",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    icon: <Gem size={20} />,
    name: "Katalog",
    subItems: [
      { name: "Daftar Katalog", path: "/catalog" },
      { name: "Tambah Katalog", path: "/catalog/add", roles: ["SUPER_ADMIN"] },
    ],
  },
  {
    icon: <Users size={20} />,
    name: "Pelanggan",
    subItems: [
      { name: "Daftar Pelanggan", path: "/customer" },
      { name: "Tambah Pelanggan", path: "/customer/add" },
    ],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Karyawan",
    roles: ["SUPER_ADMIN", "ADMIN"],
    subItems: [
      {
        name: "Daftar Karyawan",
        path: "/employee",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        name: "Tambah Karyawan",
        path: "/employee/add",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: <Building2 size={20} />,
    name: "Cabang",
    subItems: [
      { name: "Daftar Cabang", path: "/branch" },
      { name: "Tambah Cabang", path: "/branch/add", roles: ["SUPER_ADMIN"] },
    ],
  },
  {
    icon: <UserCog size={20} />,
    name: "Akun Super Admin",
    roles: ["SUPER_ADMIN"],
    subItems: [
      {
        name: "Daftar Akun",
        path: "/account",
        roles: ["SUPER_ADMIN"],
      },
      {
        name: "Tambah Akun",
        path: "/account/add",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: <BarChart3 size={20} />,
    name: "Activity Logs",
    path: "/logs",
    roles: ["SUPER_ADMIN"],
  },
  // {
  //   icon: <Calendar size={20} />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircle size={20} />,
  //   name: "User Profile",
  //   path: "/profile",
  // },

  // {
  //   name: "Forms",
  //   icon: <List size={20} />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <Table size={20} />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <FileText size={20} />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <BarChart3 size={20} />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart" },
  //     { name: "Bar Chart", path: "/bar-chart" },
  //   ],
  // },
  // {
  //   icon: <Layers size={20} />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts" },
  //     { name: "Avatar", path: "/avatars" },
  //     { name: "Badge", path: "/badge" },
  //     { name: "Buttons", path: "/buttons" },
  //     { name: "Images", path: "/images" },
  //     { name: "Videos", path: "/videos" },
  //   ],
  // },
  // {
  //   icon: <Shield size={20} />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin" },
  //     { name: "Sign Up", path: "/signup" },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const hasAccess = (roles?: AuthRoleName[]) => {
    if (!roles || roles.length === 0) return true;
    if (!user) return false;
    return roles.includes(user.role.name);
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        // Filter sub-items based on access
        const visibleSubItems = nav.subItems?.filter((subItem) =>
          hasAccess(subItem.roles),
        );

        // If it's a parent with sub-items, uses the visibleSubItems
        // If no subitems, visibleSubItems is undefined or empty

        return (
          <li key={nav.name}>
            {visibleSubItems && visibleSubItems.length > 0 ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    size={20}
                    className={`ml-auto transition-transform duration-200  ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {visibleSubItems &&
              visibleSubItems.length > 0 &&
              (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {visibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                              >
                                new
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </li>
        );
      })}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-72.5"
            : isHovered
              ? "w-72.5"
              : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={248}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={248}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal size={16} />
                )}
              </h2>
              {renderMenuItems(
                navItems.filter((item) => hasAccess(item.roles)),
                "main",
              )}
            </div>

            {/* {process.env.NEXT_PUBLIC_API_ENVIRONMENT === "dev" && (
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Others"
                  ) : (
                    <MoreHorizontal size={16} />
                  )}
                </h2>

                {renderMenuItems(
                  othersItems.filter((item) => hasAccess(item.roles)),
                  "others",
                )}
              </div>
            )} */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
