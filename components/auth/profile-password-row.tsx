"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ProfilePasswordRow() {
  const [previewVisible, setPreviewVisible] = useState(false);

  const openPasswordUpdate = () => {
    window.location.hash = "#/security/password";
  };

  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <span className="text-sm font-medium text-slate-200">Password</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openPasswordUpdate}
          className="text-sm tracking-widest text-slate-400 transition-colors hover:text-slate-200"
        >
          {previewVisible ? "Update password" : "••••••••"}
        </button>
        <button
          type="button"
          aria-label={previewVisible ? "Hide password preview" : "Show password options"}
          onClick={() => setPreviewVisible((current) => !current)}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          {previewVisible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
