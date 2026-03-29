import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { BranchModel } from "@repo/core";
import WhatsAppButton from "../WhatsAppButton";

interface BranchCardProps {
  branch: BranchModel;
}

const BranchCard = ({ branch }: BranchCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all group flex flex-col h-full">
      {/* Map Thumbnail */}
      <a
        href={`https://maps.google.com/maps?q=${branch.latitude},${branch.longitude}&t=&z=15&ie=UTF`}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video relative overflow-hidden bg-muted shrink-0"
      >
        <iframe
          title={`Peta ${branch.name}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          className="pointer-events-none"
          src={`https://maps.google.com/maps?q=${branch.latitude},${branch.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      </a>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Branch Name */}
        <h2 className="text-lg font-normal text-foreground mb-4">
          {branch.name}
        </h2>

        {/* Address */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-medium text-foreground">
              {branch.area}, {branch.city}
            </p>
            <p className="text-sm font-light text-muted-foreground mt-1">
              {branch.fullAddress}
            </p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-3 mb-4">
          <Clock size={16} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm font-light text-muted-foreground">
            <p className="text-foreground">
              Senin - Jumat: {branch.operatingHours.weekdays}
            </p>
            <p className="text-foreground">
              Sabtu: {branch.operatingHours.saturday}
            </p>
            <p className="text-foreground">
              Minggu: {branch.operatingHours.sunday}
            </p>
            <p>Libur Nasional: {branch.operatingHours.holidays}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 mb-6">
          <Phone size={16} className="text-muted-foreground shrink-0" />
          <p className="text-sm font-light text-muted-foreground">
            {branch.telp}
          </p>
        </div>

        <WhatsAppButton
          phoneNumber={branch.telp}
          message={`Halo, saya ingin bertanya tentang produk emas di cabang ${branch.name}`}
        />
      </div>
    </div>
  );
};

export default BranchCard;
