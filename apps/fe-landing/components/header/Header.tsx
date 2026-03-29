import StatusBar from "./StatusBar";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* <StatusBar /> */}
      <Navigation />
    </header>
  );
};

export default Header;
