export const metadata = {
  title: "Kebijakan Privasi - Semurni Emas",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-24 section-container">
        <div className="max-w-4xl mx-auto py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-muted-foreground">
              Terakhir diperbarui: 6 Januari 2026
            </p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Pendahuluan
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Semurni Emas menghargai privasi Anda. Kebijakan Privasi ini
                menjelaskan bagaimana kami mengelola informasi pada situs web
                kami. Kami berkomitmen untuk menjaga transparansi dan
                kepercayaan Anda sebagai pelanggan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Informasi yang Kami Kumpulkan
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Situs web kami dirancang untuk memberikan informasi tanpa
                mengumpulkan data pribadi pengunjung secara otomatis. Kami tidak
                menggunakan alat pelacak analitik atau menyimpan data profil
                pengguna.
              </p>
              <div className="bg-muted/30 p-6 rounded-lg border border-border">
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Sistem Penilaian Layanan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Satu-satunya data yang kami minta adalah{" "}
                  <strong>Nomor Invoice</strong> saat Anda memberikan penilaian
                  (rating) terhadap layanan karyawan kami. Data ini digunakan
                  semata-mata untuk memvalidasi transaksi Anda dan membantu kami
                  meningkatkan kualitas layanan di gerai kami.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Keamanan Data
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami menyimpan data penilaian secara internal dan tidak
                membagikannya kepada pihak ketiga. Karena kami tidak
                mengumpulkan informasi pembayaran atau data sensitif lainnya
                melalui situs ini, risiko data Anda sangatlah minim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Tautan Pihak Ketiga
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Situs kami mungkin berisi tautan ke media sosial atau peta
                lokasi cabang kami. Harap dicatat bahwa situs-situs tersebut
                memiliki kebijakan privasi mereka sendiri yang berada di luar
                kendali Semurni Emas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Kontak Kami
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan mengenai praktik privasi kami,
                silakan hubungi kami melalui informasi kontak di bawah ini:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p className="font-medium text-foreground">Semurni Emas</p>
                <p>Email: semumiemas@gmail.com</p>
                <p>
                  Lokasi: Kalibata City Square, UG-8021 ruang G.4150 Lantai UGF
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
