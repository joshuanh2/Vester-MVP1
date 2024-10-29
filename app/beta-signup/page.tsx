"use client";

import dynamic from 'next/dynamic';
import React from 'react';
const BetaForm = dynamic(() => import('@/components/BetaSignUp/BetaForm'), { ssr: false });

export default function BetaSignupPage() {
  return (
    <div className="w-screen h-screen">
      <BetaForm />
    </div>
  );
}