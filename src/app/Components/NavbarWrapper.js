'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarOn = ["/login", "/register", "/upload"];
  const showNavbar = !hideNavbarOn.includes(pathname);

  return showNavbar ? <Navbar /> : null;
}
