import Link from "next/link";
import Image from "next/image";

const FeaturedCollections = () => {
  const collections = [
    {
      title: "Cincin",
      image: "/rings-collection.png",
      href: "/category/ring",
      description: "Simbol keanggunan dan komitmen yang abadi.",
    },
    {
      title: "Anting",
      image: "/earrings-collection.png",
      href: "/category/earrings",
      description: "Desain halus yang menangkap dan memantulkan cahaya.",
    },
    {
      title: "Gelang",
      image: "/arcus-bracelet.png",
      href: "/category/bracelet",
      description: "Aksen elegan untuk setiap kesempatan.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4">
              Belanja Berdasarkan Koleksi
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              Jelajahi pilihan perhiasan eksklusif kami, dibuat dengan presisi
              dan dedikasi tinggi.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-foreground border-b border-foreground pb-1 text-sm tracking-widest uppercase hover:text-muted-foreground hover:border-muted-foreground transition-all"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              href={collection.href}
              className="group relative h-[600px] overflow-hidden"
            >
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 xl:bg-black/20 xl:group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-light mb-2">{collection.title}</h3>
                <p className="text-white/80 font-light max-w-xs transform translate-y-0 opacity-100 xl:translate-y-4 xl:opacity-0 xl:group-hover:translate-y-0 xl:group-hover:opacity-100 transition-all duration-500">
                  {collection.description}
                </p>
                <span className="mt-4 inline-block text-sm tracking-widest uppercase border-b border-white pb-1 w-fit transform translate-y-0 opacity-100 xl:translate-y-4 xl:opacity-0 xl:group-hover:translate-y-0 xl:group-hover:opacity-100 transition-all duration-500 xl:delay-100">
                  Lihat
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
