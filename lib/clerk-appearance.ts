import { dark } from "@clerk/themes";

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#3b82f6",
    colorBackground: "#0b1020",
    colorInputBackground: "#111827",
    colorInputText: "#f8fafc",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-[#0f172a]/95 border border-white/10 shadow-2xl backdrop-blur-sm rounded-2xl",
    headerTitle: "text-slate-50 text-xl font-bold",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10",
    formButtonPrimary:
      "bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20",
    formFieldInput:
      "bg-[#111827] border-white/10 text-slate-50 placeholder:text-slate-500 focus:border-primary/50",
    formFieldLabel: "text-slate-300 font-medium",
    footerActionLink: "text-[#93c5fd] hover:text-[#bfdbfe]",
    identityPreviewEditButton: "text-[#93c5fd]",
    formResendCodeLink: "text-[#93c5fd]",
    otpCodeFieldInput: "border-white/10 bg-[#111827] text-slate-50",
    dividerLine: "bg-white/10",
    dividerText: "text-slate-500",
    alertText: "text-slate-300",
  },
};
