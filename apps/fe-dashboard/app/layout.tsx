import { Outfit } from "next/font/google";
import "@repo/core/extension/number";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Slide, ToastContainer } from "react-toastify";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkInterceptorSetup } from "@/components/NetworkInterceptorSetup";

const outfit = Outfit({
  subsets: ["latin"],
});

const RootLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({
  children,
}) => {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <NetworkInterceptorSetup />
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              transition={Slide}
              draggable
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
