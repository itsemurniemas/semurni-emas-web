import Image from "next/image";
import Link from "next/link";

const OurStory = () => {
  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[580px] w-full lg:order-last">
            <Image
              src="/ring-home.jpg"
              alt="Semurni Emas Craftsmanship"
              fill
              priority
              className="object-cover object-center rounded-none"
            />
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-foreground/20 z-[-1] hidden md:block"></div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
                Tentang Kami
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-foreground leading-tight">
                Simbol Kepercayaan <br /> dalam Setiap Karat
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed">
              <p>
                Semurni Emas hadir sebagai destinasi terpercaya bagi mereka yang
                menghargai nilai sejati logam mulia. Kami mengkurasi koleksi
                perhiasan terbaik dan menyediakan instrumen investasi emas
                dengan standar integritas tertinggi.
              </p>
              <p>
                Selain menghadirkan karya pengrajin lokal yang memadukan tradisi
                dan modernitas, kami juga menjadi jembatan bagi sirkulasi emas
                yang bernilai—memastikan setiap transaksi, baik pembelian maupun
                buyback, dilakukan dengan transparansi penuh.
              </p>
              <p>
                Komitmen kami tetap sama: menjamin keaslian dan memberikan nilai
                akurat yang menjaga aset serta kepercayaan Anda untuk jangka
                panjang.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/employees"
                className="inline-flex items-center gap-4 group"
              >
                <span className="h-px w-12 bg-foreground transition-all duration-300 group-hover:w-20"></span>
                <span className="text-sm tracking-widest uppercase font-medium">
                  Kenali Tim Kami
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
