"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Band from '@/components/beta-signup/src/Components/Band'; // Imported Band component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavBarProps {
  features?: {
    showDomainSelector?: boolean;
    showViewModeSelector?: boolean;
    showPromptCaching?: boolean;
  };
}

const TopNavBar: React.FC<TopNavBarProps> = ({ features = {} }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="font-bold text-xl flex gap-4 items-center">
        {/* Beta Signup Button */}
        <a
          href="/beta-signup"
          className="bg-[#129de8] text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
        >
          Beta Signup
        </a>

        {/* Company Wordmark */}
        <Image
          src="/vester-name.png"
          alt="Company Wordmark"
          width={168}
          height={30}
        />
        
        {/* Subtext */}
        <span className="font-bold text-[95%]">Conversational Analytics Proof of Concept</span>
        
        {/* Band Component */}
        <Band />
      </div>

      <div className="flex items-center gap-2">
        <a href="mailto:alex@vesterai.com" className="block">
          <img src="/vester-profile.png" alt="Vester Profile" className="w-12 h-12" />
        </a>
      </div>
    </div>
  );
};

export default TopNavBar;
