import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DarkFooter from "@/components/footer/DarkFooter";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <DarkFooter />
    </div>
  );
}
