import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@repo/core";

const DarkFooter = () => {
  return (
    <footer className="w-full bg-black text-white pt-8 pb-2 border-t border-white/10">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/logo.webp"
                alt="Semurni Emas Logo"
                width={24}
                height={24}
                className="object-contain"
              />
              <p className="text-xl font-semibold tracking-wide text-white block">
                SEMURNI EMAS
              </p>
            </div>

            <p className="text-sm font-light text-white/70 leading-relaxed max-w-md mb-6">
              Toko emas dan logam mulia terpercaya
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-white/70">
              <div>
                <p className="font-normal text-white mb-1">Kunjungi Kami</p>
                <p>Kalibata City Square, UG-8021</p>
                <p>ruang G.4150 Lantai UGF</p>
              </div>
              <div>
                <p className="font-normal text-white mb-1 mt-3">Kontak</p>
                <p>+6281917965041</p>
                <p>semumiemas@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">Belanja</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    Katalog
                  </Link>
                </li>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={`/category/${category.value}`}
                      className="text-sm font-light text-white/70 hover:text-white transition-colors"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/branches"
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    Lokasi Cabang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employees"
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    Karyawan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">
                Hubungi Kami
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/branches"
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/semurniemas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-white/70 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section - edge to edge separator */}
        <div className="border-t border-white/10 -mx-6 px-6 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-light text-white/50 mb-1 md:mb-0">
              © 2026 Semurni Emas. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-sm font-light text-white/50 hover:text-white transition-colors"
              >
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DarkFooter;
