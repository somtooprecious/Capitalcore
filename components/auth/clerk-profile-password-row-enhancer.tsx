"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const EYE_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;

const EYE_CLOSED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;

function findPasswordSection(root: ParentNode): HTMLElement | null {
  const sections = root.querySelectorAll<HTMLElement>('[class*="profileSection"]');

  for (const section of sections) {
    const title = section.querySelector<HTMLElement>('[class*="profileSectionTitle"]');
    if (title?.textContent?.trim().toLowerCase() === "password") {
      return section;
    }
  }

  return null;
}

function enhancePasswordOverviewRow(root: ParentNode, onUpdatePassword: () => void) {
  const section = findPasswordSection(root);
  if (!section) return;

  const content =
    section.querySelector<HTMLElement>('[class*="profileSectionContent"]') ??
    section.querySelector<HTMLElement>('[class*="profileSectionPrimaryButton"]')?.parentElement;

  if (!content || content.querySelector("[data-cc-profile-password-eye]")) return;

  content.classList.add("cc-profile-password-content");

  const dotsButton = content.querySelector<HTMLElement>('[class*="profileSectionPrimaryButton"]');
  if (dotsButton) {
    dotsButton.classList.add("cc-profile-password-dots");
    dotsButton.dataset.ccPasswordMask = "true";
  }

  const eyeButton = document.createElement("button");
  eyeButton.type = "button";
  eyeButton.dataset.ccProfilePasswordEye = "true";
  eyeButton.className = "cc-profile-password-eye";
  eyeButton.setAttribute("aria-label", "Show password");
  eyeButton.setAttribute("aria-pressed", "false");
  eyeButton.innerHTML = EYE_OPEN;

  let revealed = false;

  const setRevealed = (next: boolean) => {
    revealed = next;
    eyeButton.setAttribute("aria-pressed", String(next));
    eyeButton.setAttribute("aria-label", next ? "Hide password" : "Show password");
    eyeButton.innerHTML = next ? EYE_CLOSED : EYE_OPEN;

    if (dotsButton) {
      dotsButton.textContent = next ? "Update password" : "••••••••";
      dotsButton.classList.toggle("cc-profile-password-dots--revealed", next);
    }
  };

  eyeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!revealed) {
      setRevealed(true);
      onUpdatePassword();
      return;
    }

    setRevealed(false);
  });

  content.appendChild(eyeButton);
}

export function ClerkProfilePasswordRowEnhancer() {
  const router = useRouter();

  useEffect(() => {
    const openPasswordUpdate = () => router.push("/settings/security/password");

    const run = () => {
      document.querySelectorAll(".clerk-profile-shell").forEach((root) => {
        enhancePasswordOverviewRow(root, openPasswordUpdate);
      });
    };

    run();

    const observers = [...document.querySelectorAll(".clerk-profile-shell")].map((root) => {
      const observer = new MutationObserver(run);
      observer.observe(root, { childList: true, subtree: true });
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [router]);

  return null;
}
