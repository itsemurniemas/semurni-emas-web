import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@repo/core";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 border-t border-[#e5e5e5] section-container">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <span className="text-xl font-semibold tracking-wide text-foreground mb-4 block">
              SEMURNI EMAS
            </span>
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Toko emas dan logam mulia terpercaya
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-black/70">
              <div>
                <p className="font-normal text-black mb-1">Kunjungi Kami</p>
                <p>Kalibata City Square, UG-8021</p>
                <p>ruang G.4150 Lantai UGF</p>
              </div>
              <div>
                <p className="font-normal text-black mb-1 mt-3">Kontak</p>
                <p>+6281917965041</p>
                <p>semumiemas@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Belanja</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-sm font-light text-black/70 hover:text-black transition-colors"
                  >
                    Katalog
                  </Link>
                </li>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={`/category/${category.value}`}
                      className="text-sm font-light text-black/70 hover:text-black transition-colors"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/branches"
                    className="text-sm font-light text-black/70 hover:text-black transition-colors"
                  >
                    Lokasi Cabang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employees"
                    className="text-sm font-light text-black/70 hover:text-black transition-colors"
                  >
                    Karyawan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Hubungi Kami</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/branches"
                    className="text-sm font-light text-black/70 hover:text-black transition-colors"
                  >
                    WhatsApp
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/semurniemas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-black/70 hover:text-black transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2026 Semurni Emas. Hak Cipta Dilindungi.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy-policy"
              className="text-sm font-light text-black hover:text-black/70 transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm font-light text-black hover:text-black/70 transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
