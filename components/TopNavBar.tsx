"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
      <div className="font-bold text-xl flex gap-2 items-center">
        <Image
          src="/vester-name.png"
          alt="Company Wordmark"
          width={168}
          height={30}
        />
        <span className="font-bold text-[95%]">Conversational Analytics Proof of Concept</span>
      </div>
      <div className="flex items-center gap-2">
        <img src="/vester-profile.png" alt="Description of Image" className="w-12 h-12" />
      </div>
    </div>
  );
};

export default TopNavBar;
