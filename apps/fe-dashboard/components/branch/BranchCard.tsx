"use client";

import { MapPin, Clock, Phone, Users, Edit, Trash2 } from "lucide-react";
import { BranchModel } from "@repo/core";
import Link from "next/link";

interface BranchCardProps {
  branch: BranchModel;
  onDelete?: (branch: BranchModel) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 dark:border-white/5 dark:bg-white/3 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-white/10 transition-all group flex flex-col h-full">
      {/* Map Thumbnail */}
      <a
        href={branch.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video relative overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0"
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
        <div className="absolute inset-0 bg-transparent" />
      </a>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Branch Name */}
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          {branch.name}
        </h2>

        {/* Address */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-medium text-gray-800 dark:text-white">
              {branch.area}, {branch.city}
            </p>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
              {branch.fullAddress}
            </p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-3 mb-4">
          <Clock size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
          <div className="text-sm font-light text-gray-600 dark:text-gray-400">
            <p className="text-gray-700 dark:text-gray-300">
              Senin - Jumat: {branch.operatingHours.weekdays}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Sabtu: {branch.operatingHours.saturday}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Minggu: {branch.operatingHours.sunday}
            </p>
            <p>Libur: {branch.operatingHours.holidays}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 mb-4">
          <Phone size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
          <p className="text-sm font-light text-gray-600 dark:text-gray-400">
            {branch.telp}
          </p>
        </div>

        {/* Employee Count */}
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
          <Users size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
          <p className="text-sm font-light text-gray-600 dark:text-gray-400">
            {branch.employeeCount} Karyawan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <Link
            href={`/branch/${branch.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Edit size={16} />
            Edit
          </Link>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
            onClick={() => onDelete?.(branch)}
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
