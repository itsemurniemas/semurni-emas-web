import { Suspense } from "react";
import CatalogContent from "./CatalogContent";

function CatalogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-24 section-container">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-muted rounded w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}
