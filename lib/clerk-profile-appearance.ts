import { clerkAppearance } from "@/lib/clerk-appearance";

export const clerkProfileAppearance = {
  ...clerkAppearance,
  variables: {
    ...clerkAppearance.variables,
    colorBackground: "#0d1428",
    colorInputBackground: "#111827",
    colorInputText: "#f8fafc",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
  },
  elements: {
    ...clerkAppearance.elements,
    rootBox: "w-full clerk-profile-shell",
    card: "shadow-none border-0 bg-transparent w-full",
    navbar: "hidden",
    navbarMobileMenuButton: "hidden",
    headerTitle: "!text-slate-50",
    headerSubtitle: "!text-slate-400",
    profileSectionTitle: "!text-slate-50",
    profileSectionTitleText: "!text-slate-50",
    profileSectionContent: "!text-slate-300",
    profileSectionPrimaryButton: "!text-slate-300",
    profileSectionItem: "!text-slate-300 border-white/10",
    profileSectionItemListButton: "!text-slate-300",
    formFieldInputGroup: "relative flex w-full items-stretch",
    formFieldInput:
      "bg-[#111827] border-white/15 !text-slate-50 placeholder:text-slate-500 focus:border-primary/60 !pr-11 w-full min-h-11",
    formFieldInputShowPasswordButton:
      "!text-slate-300 hover:!text-slate-50 opacity-100 flex items-center justify-center min-w-8 min-h-8 inset-y-0 my-auto",
    formFieldInputShowPasswordIcon: "!text-slate-300 w-4 h-4",
    formFieldLabel: "!text-slate-200",
    formButtonPrimary: "bg-primary hover:bg-primary/90 !text-white font-semibold",
    pageScrollBox: "p-0",
    scrollBox: "p-0",
  },
};
