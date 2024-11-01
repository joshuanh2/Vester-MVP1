"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link component from Next.js

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

        {/* Company Wordmark */}
        <Image
          src="/vester-name-logo.png"
          alt="Company Wordmark"
          width={168}
          height={30}
        />
        
        {/* Subtext */}
        <span className="font-bold text-[95%]">Conversational Analytics Proof of Concept</span>
        
      </div>

      <div className="flex items-center gap-2">
        <Link href="/beta-signup" passHref>
          <span className="bg-[#129de8] text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mr-5">
            Beta Signup
          </span>
        </Link>
        <a href="mailto:alex@vesterai.com" className="block">
          <img src="/vester-profile.png" alt="Vester Profile" className="w-12 h-12" />
        </a>
      </div>
    </div>
  );
};

export default TopNavBar;
