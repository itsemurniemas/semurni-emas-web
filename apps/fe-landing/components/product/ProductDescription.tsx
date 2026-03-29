import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogModel } from "@repo/core";
import ReviewProduct from "./ReviewProduct";

const CustomStar = ({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-3 h-3 ${
      filled ? "text-foreground" : "text-muted-foreground/30"
    } ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
      clipRule="evenodd"
    />
  </svg>
);

interface ProductDescriptionProps {
  catalog: CatalogModel;
}

const ProductDescription = ({ catalog }: ProductDescriptionProps) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Generate description based on product type
  const getDescription = () => {
    if (catalog.product.goldJewelryItem) {
      return {
        intro: `${catalog.displayName} adalah perhiasan emas berkualitas tinggi yang dirancang dengan sempurna. Setiap detail telah dipertimbangkan dengan cermat untuk memastikan keindahan dan daya tahan yang luar biasa.`,
        details: `Dibuat dengan emas murni dan keahlian pengrajin terbaik kami, perhiasan ini menampilkan desain yang elegan dan monumental. Lapisan pelindung memastikan warna dan kilau tetap terjaga untuk jangka waktu yang panjang.`,
      };
    } else if (catalog.product.goldBarItem) {
      return {
        intro: `${catalog.displayName} adalah emas batangan murni dengan sertifikat keaslian internasional. Setiap batang diproduksi dengan standar kualitas tertinggi dan pengawasan kualitas yang ketat.`,
        details: `Produk ini ideal untuk investasi jangka panjang dan disimpan dengan aman. Emas batangan kami dijamin murni dan memiliki nilai yang stabil di pasar global.`,
      };
    } else if (catalog.product.nonGoldItem) {
      return {
        intro: `${catalog.displayName} adalah perhiasan premium yang dibuat dengan logam berkualitas tinggi lainnya. Desain yang elegan dan bahan berkualitas membuat produk ini sempurna untuk berbagai kesempatan.`,
        details: `Dengan perhatian terhadap detail dan pengerjaan yang sempurna, produk ini menggabungkan gaya modern dengan ketahanan jangka panjang.`,
      };
    }
    return {
      intro: "Produk berkualitas premium.",
      details: "Didesain dengan sempurna untuk kepuasan pelanggan.",
    };
  };

  const description = getDescription();
  const skuLabel = catalog.id.substring(0, 8).toUpperCase();

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Deskripsi</span>
          {isDescriptionOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isDescriptionOpen && (
          <div className="pb-6 space-y-4">
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              {description.intro}
            </p>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              {description.details}
            </p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Detail Produk</span>
          {isDetailsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isDetailsOpen && (
          <div className="pb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">
                SKU
              </span>
              <span className="text-sm font-light text-foreground">
                {skuLabel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">
                Berat Total
              </span>
              <span className="text-sm font-light text-foreground">
                {catalog.totalWeightGram.toFixed(2)}g
              </span>
            </div>
            {catalog.quantity > 0 && (
              <div className="flex justify-between">
                <span className="text-sm font-light text-muted-foreground">
                  Stok
                </span>
                <span className="text-sm font-light text-foreground">
                  {catalog.quantity} unit
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Care Instructions */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsCareOpen(!isCareOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Perawatan & Pembersihan</span>
          {isCareOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isCareOpen && (
          <div className="pb-6 space-y-4">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">
                • Bersihkan dengan kain lembut dan kering setelah setiap
                pemakaian
              </li>
              <li className="text-sm font-light text-muted-foreground">
                • Hindari kontak dengan parfum, losion, dan produk pembersih
              </li>
              <li className="text-sm font-light text-muted-foreground">
                • Simpan dalam kantong perhiasan yang disediakan saat tidak
                digunakan
              </li>
              <li className="text-sm font-light text-muted-foreground">
                • Lepas sebelum berenang, berolahraga, atau mandi
              </li>
            </ul>
            <p className="text-sm font-light text-muted-foreground">
              Untuk pembersihan profesional, kunjungi toko perhiasan setempat
              atau hubungi layanan pelanggan kami.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="border-b border-border lg:mb-16">
        <Button
          variant="ghost"
          onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <div className="flex items-center gap-3">
            <span>Ulasan Pelanggan</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <CustomStar key={star} filled={star <= 4.8} />
              ))}
              <span className="text-sm font-light text-muted-foreground ml-1">
                4.8
              </span>
            </div>
          </div>
          {isReviewsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isReviewsOpen && (
          <div className="pb-6 space-y-6">
            {/* Review Product Button */}
            <ReviewProduct />

            {/* Reviews List */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar key={star} filled={true} />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">
                    Sarah M.
                  </span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "Produk yang benar-benar menakjubkan! Kualitasnya luar biasa
                  dan cocok dengan segalanya. Desainnya sangat unik dan saya
                  mendapat pujian setiap kali memakainya."
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar key={star} filled={star <= 4} />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">
                    Emma T.
                  </span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "Keahlian pengrajin yang indah dan nyaman dipakai sepanjang
                  hari. Kualitasnya bertahan sempurna setelah berbulan-bulan
                  pemakaian rutin. Sangat direkomendasikan!"
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar key={star} filled={true} />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">
                    Jessica R.
                  </span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "Produk ini adalah karya seni. Desainnya elegan dan canggih.
                  Beratnya pas dan kemasannya juga cantik."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
