import CheckoutHeader from "@/components/header/CheckoutHeader";
import Footer from "@/components/footer/Footer";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CheckoutHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
