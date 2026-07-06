"use client";

import { useEffect } from "react";

const EYE_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';

const EYE_CLOSED =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';

function ensureInputGroup(input: HTMLInputElement): HTMLElement | null {
  const existing = input.closest<HTMLElement>(".cl-formFieldInputGroup");
  if (existing) return existing;

  const parent = input.parentElement;
  if (!parent) return null;

  if (parent.classList.contains("cc-password-input-wrap")) return parent;

  const wrap = document.createElement("div");
  wrap.className = "cl-formFieldInputGroup cc-password-field cc-password-input-wrap";
  parent.insertBefore(wrap, input);
  wrap.appendChild(input);
  return wrap;
}

function attachCustomToggle(input: HTMLInputElement, group: HTMLElement) {
  if (group.querySelector("[data-cc-password-eye]")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.ccPasswordEye = "true";
  button.className = "cc-password-eye-btn";
  button.setAttribute("aria-label", "Show password");
  button.innerHTML = EYE_OPEN;

  button.addEventListener("click", () => {
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    button.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    button.innerHTML = visible ? EYE_OPEN : EYE_CLOSED;
  });

  group.appendChild(button);
}

function enhancePasswordFields(root: ParentNode) {
  root
    .querySelectorAll<HTMLInputElement>(
      'input[type="password"], input[type="text"][autocomplete*="password"], input[type="text"][name*="password" i]'
    )
    .forEach((input) => {
      const group = ensureInputGroup(input);
      if (!group) return;

      group.classList.add("cc-password-field");
      input.classList.add("cc-password-input");

      const clerkButton = group.querySelector<HTMLElement>(".cl-formFieldInputShowPasswordButton");
      if (clerkButton) {
        if (clerkButton.parentElement !== group) {
          group.appendChild(clerkButton);
        }
        return;
      }

      if (input.type === "password") {
        attachCustomToggle(input, group);
      }
    });
}

export function ClerkPasswordEyeEnhancer() {
  useEffect(() => {
    const roots = document.querySelectorAll(".auth-clerk-shell, .clerk-profile-shell");
    if (!roots.length) return;

    const run = () => roots.forEach((root) => enhancePasswordFields(root));

    run();
    const observers = [...roots].map((root) => {
      const observer = new MutationObserver(run);
      observer.observe(root, { childList: true, subtree: true });
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
