import React from "react";

export function FiverrLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center shrink-0`}>
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="256" cy="256" r="256" fill="#1dbf73" />
        {/* Connected 'f' and 'i' of Fiverr */}
        <path
          d="M266,236 c0-65 35-100 100-100 h40 v50 h-40 c-35,0-50,15-50,50 v80 h120 v220 h-50 V366 h-70 v170 h-50 V366 h-30 v-50 h30 V236 z"
          fill="#ffffff"
        />
        <circle cx="411" cy="206" r="25" fill="#ffffff" />
      </svg>
    </div>
  );
}
