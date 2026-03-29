const WhyChooseUs = () => {
  const features = [
    {
      number: "Pilihan",
      title: "Koleksi Terkurasi",
      description:
        "Dari perhiasan harian hingga instrumen investasi emas batangan",
    },
    {
      number: "2",
      title: "Cabang Strategis",
      description:
        "Layanan tatap muka untuk transaksi yang lebih aman dan nyaman",
    },
    {
      number: "Teruji",
      title: "Kadar Akurat",
      description:
        "Standar pengujian ketat untuk menjamin ketepatan kadar di setiap karat",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Standar Baru Transaksi Emas
          </h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Semurni Emas menghadirkan transparansi dan integritas dalam setiap
            gramnya, memastikan nilai aset Anda terjaga dengan standar
            profesional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-light text-primary mb-4">
                {feature.number}
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
