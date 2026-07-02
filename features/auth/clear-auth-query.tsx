"use client";

import { useEffect } from "react";

/** Removes accidental query-string credentials from the URL bar after a native form submit. */
export function ClearAuthQuery() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return null;
}
