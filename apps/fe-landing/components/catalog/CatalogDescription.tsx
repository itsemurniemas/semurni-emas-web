import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogModel } from "@repo/core";

interface CatalogDescriptionProps {
  catalog: CatalogModel;
}

const CatalogDescription = ({ catalog }: CatalogDescriptionProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Catalog Details */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Detail Katalog</span>
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
    </div>
  );
};

export default CatalogDescription;
