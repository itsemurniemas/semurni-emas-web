import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BranchModel } from "@repo/core";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  selectedBranch?: string | null;
  setSelectedBranch?: (branchId: string | null) => void;
  minPrice?: string;
  setMinPrice?: (price: string) => void;
  maxPrice?: string;
  setMaxPrice?: (price: string) => void;
  onApplyFilters?: () => void;
  branches?: BranchModel[];
  isLoading?: boolean;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  selectedBranch,
  setSelectedBranch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApplyFilters,
  branches = [],
  isLoading = false,
}: FilterSortBarProps) => {
  const [sortBy, setSortBy] = useState("featured");

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMinPrice?.(value ? `Rp ${value}` : "");
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMaxPrice?.(value ? `Rp ${value}` : "");
  };

  const handleApplyFilters = () => {
    onApplyFilters?.();
  };

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount} items
          </p>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;
