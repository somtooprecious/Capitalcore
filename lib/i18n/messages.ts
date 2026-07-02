import type { Locale } from "@/lib/i18n/types";

export type StepItem = { step: string; title: string; body: string };
export type FeatureItem = { title: string; body: string };
export type FaqItem = { question: string; answer: string };

export type PageContent = {
  title: string;
  description: string;
  intro?: string;
  introSecondary?: string;
  steps?: StepItem[];
  features?: FeatureItem[];
  sections?: { title: string; body: string }[];
  cta?: string;
  backHome?: string;
};

export type Messages = {
  nav: Record<string, string>;
  header: Record<string, string>;
  footer: Record<string, string>;
  common: Record<string, string>;
  pages: Record<string, PageContent>;
  faq: FaqItem[];
};

const enPages: Messages["pages"] = {
  howItWorks: {
    title: "How It Works",
    description:
      "A clear, step-by-step path from registration to funding, daily tasks, earnings, and withdrawals on CapitalCore AI.",
    intro:
      "CapitalCore AI is built as a transparent trading and treasury platform. Every reward, task, and limit is configured by platform administration—never hidden behind vague marketing claims.",
    introSecondary:
      "Whether you are exploring markets for the first time or managing an active trading routine, the workflow below shows exactly how the platform is designed to operate.",
    steps: [
      {
        step: "01",
        title: "Create and verify your account",
        body: "Register with your email, set a strong password, and enable two-factor authentication from Settings. Complete KYC when you need higher limits or full treasury access.",
      },
      {
        step: "02",
        title: "Fund your wallet with crypto",
        body: "Generate a deposit request for BTC, USDT, or ETH. Once your transfer is confirmed, the balance appears in your dashboard and is available for trading and platform activities.",
      },
      {
        step: "03",
        title: "Trade and complete daily tasks",
        body: "Open the trading workspace for live charts and orders. Complete admin-configured daily tasks to earn transparent platform rewards tracked in your Earnings workspace.",
      },
      {
        step: "04",
        title: "Track earnings and withdraw",
        body: "Monitor referral commissions, task rewards, and activity history. Submit withdrawal requests that follow admin-defined minimums, cooldowns, and approval rules.",
      },
    ],
    sections: [
      {
        title: "What makes this different",
        body: "Rewards are administrative configuration—not presented as guaranteed autonomous AI trading profits unless backed by real execution infrastructure.",
      },
      {
        title: "Support at every stage",
        body: "Use live chat, the support center, or email for help with deposits, verification, and account security.",
      },
    ],
    cta: "Open an account",
    backHome: "← Back to home",
  },
  aiTechnology: {
    title: "AI Technology",
    description:
      "Understand how configurable automation, market intelligence, and treasury controls work on CapitalCore AI—explained clearly and honestly.",
    intro:
      "CapitalCore AI uses the term “AI” to describe configurable platform automation: daily task engines, reward logic, notification workflows, and optional broker-assisted order routing—not unverified claims of autonomous profit generation.",
    introSecondary:
      "When live broker integration is enabled by administration, orders may use external market data. Otherwise, demo fills and admin-configured rules apply transparently.",
    features: [
      {
        title: "Configurable reward engine",
        body: "Owners set daily task amounts, referral percentages, deposit limits, and withdrawal cooldowns from the admin control center.",
      },
      {
        title: "Market intelligence layer",
        body: "TradingView-powered charts, responsive dashboards, and multi-asset symbol support across crypto, forex, equities, and commodities.",
      },
      {
        title: "Broker-ready execution path",
        body: "Manual and AI-assisted trades flow through a broker service layer. Demo mode uses simulated quotes; live mode can connect to Alpha Vantage when configured.",
      },
      {
        title: "Audit-ready treasury",
        body: "Deposits, withdrawals, earnings, admin actions, and login history are logged for reconciliation and owner oversight.",
      },
      {
        title: "Security automation",
        body: "TOTP two-factor authentication, session management, role-based admin access, and email notifications for key account events.",
      },
      {
        title: "Multi-language platform",
        body: "Switch between English, Spanish, French, and German from the header. Currency display preferences are saved to your profile when signed in.",
      },
    ],
    cta: "Explore trading workspace",
    backHome: "← Back to home",
  },
  features: {
    title: "Platform Features",
    description:
      "Everything included in CapitalCore AI—from live trading and daily tasks to crypto treasury, referrals, and owner administration.",
    intro:
      "CapitalCore AI combines professional trading tools with a configurable rewards layer. The features below are available across desktop, tablet, and mobile layouts.",
    features: [
      { title: "AI trading workspace", body: "Place manual orders or run AI-assisted trades with order history and broker integration." },
      { title: "Live market charts", body: "TradingView widgets with symbol search, intervals, and multi-asset coverage." },
      { title: "Daily tasks & streaks", body: "Complete admin-configured tasks and track rewards with transparent history." },
      { title: "Earnings dashboard", body: "View income by source, export CSV/PDF reports, and monitor configured payouts." },
      { title: "Crypto treasury", body: "Deposit with BTC, USDT, or ETH. Withdrawals follow approval workflows with status tracking." },
      { title: "Referral program", body: "Share your code, invite users, and track commissions in the referrals workspace." },
      { title: "Notifications & support", body: "In-app alerts, support tickets, and live chat for account assistance." },
      { title: "Owner admin console", body: "Users, payments, withdrawals, blog CMS, platform settings, and transaction exports." },
    ],
    cta: "Get started",
    backHome: "← Back to home",
  },
  markets: {
    title: "Markets",
    description: "Trade and research crypto, forex, equities, and commodities from one professional workspace.",
    intro: "CapitalCore AI supports multi-asset market access with live charting and integrated treasury controls.",
    backHome: "← Back to home",
  },
  faq: {
    title: "FAQ",
    description: "Answers to common questions about trading, funding, security, and platform rewards.",
    backHome: "← Back to home",
  },
  contact: {
    title: "Contact",
    description: "Reach the CapitalCore AI team for account, technical, and compliance inquiries.",
    intro: "Use live chat on any page, open a support ticket from your dashboard, or email our team during business hours.",
    sections: [
      { title: "Account support", body: "Help with sign-in, 2FA, KYC verification, and profile settings." },
      { title: "Treasury support", body: "Questions about crypto deposits, withdrawal status, and transaction history." },
      { title: "Platform feedback", body: "Suggestions for features, languages, or admin configuration improvements." },
    ],
    backHome: "← Back to home",
  },
};

const esPages: Messages["pages"] = {
  howItWorks: {
    title: "Cómo funciona",
    description: "Un recorrido claro desde el registro hasta el financiamiento, tareas diarias, ganancias y retiros.",
    intro: "CapitalCore AI es una plataforma transparente de trading y tesorería. Cada recompensa y límite lo configura la administración.",
    introSecondary: "Ya sea que explore mercados por primera vez o gestione una rutina activa, el flujo siguiente muestra cómo opera la plataforma.",
    steps: [
      { step: "01", title: "Cree y verifique su cuenta", body: "Regístrese, active 2FA y complete KYC cuando necesite límites completos." },
      { step: "02", title: "Deposite cripto en su billetera", body: "Genere un depósito en BTC, USDT o ETH. Tras la confirmación, el saldo aparece en su panel." },
      { step: "03", title: "Opere y complete tareas diarias", body: "Use el espacio de trading y las tareas configuradas para ganar recompensas transparentes." },
      { step: "04", title: "Controle ganancias y retire", body: "Monitoree referidos y recompensas. Solicite retiros según las reglas de la plataforma." },
    ],
    sections: [
      { title: "Qué nos diferencia", body: "Las recompensas son configuración administrativa, no ganancias garantizadas de IA autónoma." },
      { title: "Soporte en cada etapa", body: "Chat en vivo, centro de soporte y tickets para depósitos y verificación." },
    ],
    cta: "Abrir cuenta",
    backHome: "← Volver al inicio",
  },
  aiTechnology: {
    title: "Tecnología IA",
    description: "Automatización configurable, inteligencia de mercado y controles de tesorería explicados con claridad.",
    intro: "Nuestra capa de IA describe automatización configurable: tareas, recompensas y flujos—notificaciones—no promesas no verificadas de ganancias autónomas.",
    introSecondary: "Con integración de broker activa, las órdenes pueden usar datos externos; en modo demo, las reglas se aplican de forma transparente.",
    features: [
      { title: "Motor de recompensas", body: "Los administradores definen tareas diarias, referidos y límites de retiro." },
      { title: "Capa de mercado", body: "Gráficos TradingView y paneles responsivos para múltiples activos." },
      { title: "Ejecución con broker", body: "Órdenes manuales o asistidas por IA con modo demo o datos en vivo." },
      { title: "Tesorería auditada", body: "Depósitos, retiros y acciones admin quedan registrados." },
      { title: "Seguridad", body: "2FA, roles de admin y alertas por correo para eventos clave." },
      { title: "Multiidioma", body: "Cambie entre inglés, español, francés y alemán desde el encabezado." },
    ],
    cta: "Explorar trading",
    backHome: "← Volver al inicio",
  },
  features: {
    title: "Funciones",
    description: "Todo lo incluido en CapitalCore AI: trading, tareas, tesorería, referidos y administración.",
    intro: "Herramientas profesionales de trading con una capa de recompensas configurable en todos los dispositivos.",
    features: [
      { title: "Espacio de trading IA", body: "Órdenes manuales o asistidas con historial completo." },
      { title: "Gráficos en vivo", body: "Widgets TradingView con búsqueda de símbolos e intervalos." },
      { title: "Tareas diarias", body: "Complete tareas y siga recompensas con historial transparente." },
      { title: "Panel de ganancias", body: "Ingresos por fuente y exportación CSV/PDF." },
      { title: "Tesorería cripto", body: "Depósitos BTC, USDT, ETH y retiros con aprobación." },
      { title: "Programa de referidos", body: "Invite usuarios y controle comisiones." },
      { title: "Notificaciones y soporte", body: "Alertas, tickets y chat en vivo." },
      { title: "Consola admin", body: "Usuarios, pagos, retiros, blog y configuración." },
    ],
    cta: "Comenzar",
    backHome: "← Volver al inicio",
  },
  markets: { title: "Mercados", description: "Opere e investigue cripto, forex, acciones y materias primas.", intro: "Acceso multiactivo con gráficos en vivo.", backHome: "← Volver al inicio" },
  faq: { title: "Preguntas frecuentes", description: "Respuestas sobre trading, fondos, seguridad y recompensas.", backHome: "← Volver al inicio" },
  contact: {
    title: "Contacto",
    description: "Comuníquese con el equipo de CapitalCore AI.",
    intro: "Use el chat en vivo, tickets de soporte o correo en horario laboral.",
    sections: [
      { title: "Soporte de cuenta", body: "Acceso, 2FA, KYC y ajustes de perfil." },
      { title: "Soporte de tesorería", body: "Depósitos, retiros e historial." },
      { title: "Comentarios", body: "Sugerencias de funciones e idiomas." },
    ],
    backHome: "← Volver al inicio",
  },
};

const frPages: Messages["pages"] = {
  howItWorks: {
    title: "Comment ça marche",
    description: "Parcours clair de l'inscription au financement, aux tâches quotidiennes et aux retraits.",
    intro: "CapitalCore AI est une plateforme transparente. Chaque récompense est configurée par l'administration.",
    introSecondary: "Que vous découvriez les marchés ou gériez une routine active, voici le fonctionnement de la plateforme.",
    steps: [
      { step: "01", title: "Créez et vérifiez votre compte", body: "Inscrivez-vous, activez la 2FA et complétez le KYC si nécessaire." },
      { step: "02", title: "Alimentez votre portefeuille", body: "Déposez en BTC, USDT ou ETH. Le solde apparaît après confirmation." },
      { step: "03", title: "Tradez et accomplissez les tâches", body: "Utilisez l'espace trading et les tâches configurées pour des récompenses transparentes." },
      { step: "04", title: "Suivez les gains et retirez", body: "Consultez parrainages et récompenses. Retraits selon les règles admin." },
    ],
    sections: [
      { title: "Notre différence", body: "Les récompenses sont administratives, pas des profits IA garantis." },
      { title: "Support continu", body: "Chat, centre d'aide et tickets pour dépôts et vérification." },
    ],
    cta: "Ouvrir un compte",
    backHome: "← Retour à l'accueil",
  },
  aiTechnology: {
    title: "Technologie IA",
    description: "Automatisation configurable, intelligence marché et contrôles de trésorerie expliqués clairement.",
    intro: "Notre couche IA désigne l'automatisation configurable—tâches, récompenses, notifications—sans promesses non vérifiées.",
    introSecondary: "Avec un broker actif, les ordres peuvent utiliser des données externes ; en démo, les règles restent transparentes.",
    features: [
      { title: "Moteur de récompenses", body: "Les admins définissent tâches, parrainages et limites de retrait." },
      { title: "Intelligence marché", body: "Graphiques TradingView et tableaux de bord responsives." },
      { title: "Exécution broker", body: "Ordres manuels ou assistés par IA, mode démo ou live." },
      { title: "Trésorerie auditée", body: "Dépôts, retraits et actions admin journalisés." },
      { title: "Sécurité", body: "2FA, rôles admin et alertes e-mail." },
      { title: "Multilingue", body: "Anglais, espagnol, français et allemand depuis l'en-tête." },
    ],
    cta: "Explorer le trading",
    backHome: "← Retour à l'accueil",
  },
  features: {
    title: "Fonctionnalités",
    description: "Tout ce qui est inclus : trading, tâches, trésorerie, parrainages et admin.",
    intro: "Outils de trading professionnels avec récompenses configurables sur tous les appareils.",
    features: [
      { title: "Espace trading IA", body: "Ordres manuels ou assistés avec historique." },
      { title: "Graphiques live", body: "Widgets TradingView multi-actifs." },
      { title: "Tâches quotidiennes", body: "Récompenses transparentes et historique." },
      { title: "Gains", body: "Revenus par source et export CSV/PDF." },
      { title: "Trésorerie crypto", body: "Dépôts et retraits avec approbation." },
      { title: "Parrainage", body: "Invitations et commissions." },
      { title: "Notifications", body: "Alertes, tickets et chat." },
      { title: "Console admin", body: "Utilisateurs, paiements, blog, paramètres." },
    ],
    cta: "Commencer",
    backHome: "← Retour à l'accueil",
  },
  markets: { title: "Marchés", description: "Crypto, forex, actions et matières premières.", intro: "Accès multi-actifs avec graphiques live.", backHome: "← Retour à l'accueil" },
  faq: { title: "FAQ", description: "Questions sur trading, fonds et sécurité.", backHome: "← Retour à l'accueil" },
  contact: {
    title: "Contact",
    description: "Contactez l'équipe CapitalCore AI.",
    intro: "Chat en direct, tickets ou e-mail aux heures ouvrables.",
    sections: [
      { title: "Compte", body: "Connexion, 2FA, KYC et profil." },
      { title: "Trésorerie", body: "Dépôts, retraits et historique." },
      { title: "Retours", body: "Suggestions de fonctionnalités." },
    ],
    backHome: "← Retour à l'accueil",
  },
};

const dePages: Messages["pages"] = {
  howItWorks: {
    title: "So funktioniert es",
    description: "Klarer Weg von der Registrierung über Einzahlung, tägliche Aufgaben bis zu Auszahlungen.",
    intro: "CapitalCore AI ist eine transparente Trading- und Treasury-Plattform. Belohnungen werden von der Administration konfiguriert.",
    introSecondary: "Ob Sie Märkte neu erkunden oder aktiv handeln—so ist der Ablauf aufgebaut.",
    steps: [
      { step: "01", title: "Konto erstellen und verifizieren", body: "Registrieren, 2FA aktivieren und KYC bei Bedarf abschließen." },
      { step: "02", title: "Wallet mit Krypto aufladen", body: "Einzahlung in BTC, USDT oder ETH. Nach Bestätigung erscheint das Guthaben." },
      { step: "03", title: "Handeln und Aufgaben erledigen", body: "Trading-Bereich nutzen und konfigurierte tägliche Aufgaben für transparente Belohnungen." },
      { step: "04", title: "Einnahmen verfolgen und auszahlen", body: "Referrals und Belohnungen prüfen. Auszahlungen nach Plattformregeln." },
    ],
    sections: [
      { title: "Unser Unterschied", body: "Belohnungen sind Admin-Konfiguration, keine garantierten KI-Gewinne." },
      { title: "Support", body: "Live-Chat, Support-Center und Tickets für Einzahlungen und Verifizierung." },
    ],
    cta: "Konto eröffnen",
    backHome: "← Zur Startseite",
  },
  aiTechnology: {
    title: "KI-Technologie",
    description: "Konfigurierbare Automatisierung, Marktdaten und Treasury-Kontrollen—klar erklärt.",
    intro: "Unsere KI-Schicht bedeutet konfigurierbare Automatisierung—Aufgaben, Belohnungen, Benachrichtigungen—ohne unbelegte Gewinnversprechen.",
    introSecondary: "Mit aktivem Broker können Orders externe Daten nutzen; im Demo-Modus gelten transparente Regeln.",
    features: [
      { title: "Belohnungs-Engine", body: "Admins setzen tägliche Aufgaben, Referrals und Auszahlungslimits." },
      { title: "Markt-Intelligence", body: "TradingView-Charts und responsive Dashboards." },
      { title: "Broker-Ausführung", body: "Manuelle oder KI-unterstützte Orders, Demo oder Live." },
      { title: "Audit-fähige Treasury", body: "Einzahlungen, Auszahlungen und Admin-Aktionen protokolliert." },
      { title: "Sicherheit", body: "2FA, Admin-Rollen und E-Mail-Benachrichtigungen." },
      { title: "Mehrsprachig", body: "Englisch, Spanisch, Französisch und Deutsch in der Kopfzeile." },
    ],
    cta: "Trading erkunden",
    backHome: "← Zur Startseite",
  },
  features: {
    title: "Funktionen",
    description: "Alles in CapitalCore AI: Trading, Aufgaben, Treasury, Referrals und Admin.",
    intro: "Professionelle Trading-Tools mit konfigurierbaren Belohnungen auf allen Geräten.",
    features: [
      { title: "KI-Trading-Bereich", body: "Manuelle oder assistierte Orders mit Verlauf." },
      { title: "Live-Charts", body: "TradingView-Widgets für mehrere Asset-Klassen." },
      { title: "Tägliche Aufgaben", body: "Transparente Belohnungen und Verlauf." },
      { title: "Einnahmen", body: "Einkommen nach Quelle, CSV/PDF-Export." },
      { title: "Krypto-Treasury", body: "Ein- und Auszahlungen mit Freigabe." },
      { title: "Referral-Programm", body: "Einladungen und Provisionen." },
      { title: "Benachrichtigungen", body: "Alerts, Tickets und Live-Chat." },
      { title: "Admin-Konsole", body: "Nutzer, Zahlungen, Blog, Einstellungen." },
    ],
    cta: "Loslegen",
    backHome: "← Zur Startseite",
  },
  markets: { title: "Märkte", description: "Krypto, Forex, Aktien und Rohstoffe.", intro: "Multi-Asset-Zugang mit Live-Charts.", backHome: "← Zur Startseite" },
  faq: { title: "FAQ", description: "Antworten zu Trading, Guthaben und Sicherheit.", backHome: "← Zur Startseite" },
  contact: {
    title: "Kontakt",
    description: "Erreichen Sie das CapitalCore AI Team.",
    intro: "Live-Chat, Support-Tickets oder E-Mail während der Geschäftszeiten.",
    sections: [
      { title: "Konto-Support", body: "Anmeldung, 2FA, KYC und Profil." },
      { title: "Treasury-Support", body: "Einzahlungen, Auszahlungen und Verlauf." },
      { title: "Feedback", body: "Vorschläge für Funktionen und Sprachen." },
    ],
    backHome: "← Zur Startseite",
  },
};

const enFaq: FaqItem[] = [
  { question: "How do I get started on CapitalCore AI?", answer: "Create an account, fund your wallet with cryptocurrency, open the trading workspace, and complete daily tasks to earn configured platform rewards." },
  { question: "What markets can I trade?", answer: "Crypto, forex, stocks, and commodities from one dashboard with live charts and order workflows." },
  { question: "How long do deposits and withdrawals take?", answer: "Deposits appear after confirmation. Withdrawals follow admin review and configurable cooldown rules with status in your dashboard." },
  { question: "Do I need KYC verification?", answer: "KYC helps protect your account and unlocks higher limits and faster compliance approvals." },
  { question: "Are configured rewards guaranteed trading profits?", answer: "No. Daily task rewards and platform earnings are set by administration—not autonomous AI trading profits unless explicitly backed by live execution." },
  { question: "How does the referral program work?", answer: "Share your referral link. When invited users meet activity conditions, commissions appear in your referrals workspace." },
];

const esFaq: FaqItem[] = [
  { question: "¿Cómo empiezo en CapitalCore AI?", answer: "Cree una cuenta, deposite cripto, abra el espacio de trading y complete tareas diarias para ganar recompensas configuradas." },
  { question: "¿Qué mercados puedo operar?", answer: "Cripto, forex, acciones y materias primas desde un panel con gráficos en vivo." },
  { question: "¿Cuánto tardan depósitos y retiros?", answer: "Los depósitos aparecen tras confirmación. Los retiros siguen revisión admin y reglas de espera." },
  { question: "¿Necesito verificación KYC?", answer: "KYC protege su cuenta y desbloquea límites más altos." },
  { question: "¿Las recompensas son ganancias garantizadas?", answer: "No. Son configuración administrativa, no ganancias autónomas de IA." },
  { question: "¿Cómo funciona el programa de referidos?", answer: "Comparta su enlace. Las comisiones aparecen cuando los invitados cumplen condiciones de actividad." },
];

const frFaq: FaqItem[] = [
  { question: "Comment démarrer sur CapitalCore AI ?", answer: "Créez un compte, déposez de la crypto, ouvrez le trading et accomplissez les tâches quotidiennes." },
  { question: "Quels marchés puis-je trader ?", answer: "Crypto, forex, actions et matières premières avec graphiques live." },
  { question: "Délai des dépôts et retraits ?", answer: "Dépôts après confirmation. Retraits soumis à revue admin et règles de délai." },
  { question: "KYC obligatoire ?", answer: "Le KYC protège votre compte et augmente les limites." },
  { question: "Les récompenses sont-elles garanties ?", answer: "Non. Configuration admin, pas profits IA autonomes garantis." },
  { question: "Programme de parrainage ?", answer: "Partagez votre lien ; les commissions apparaissent selon l'activité des filleuls." },
];

const deFaq: FaqItem[] = [
  { question: "Wie starte ich bei CapitalCore AI?", answer: "Konto erstellen, Krypto einzahlen, Trading öffnen und tägliche Aufgaben für konfigurierte Belohnungen." },
  { question: "Welche Märkte kann ich handeln?", answer: "Krypto, Forex, Aktien und Rohstoffe mit Live-Charts." },
  { question: "Wie lange dauern Ein- und Auszahlungen?", answer: "Einzahlungen nach Bestätigung. Auszahlungen nach Admin-Prüfung und Wartezeiten." },
  { question: "Brauche ich KYC?", answer: "KYC schützt Ihr Konto und erhöht Limits." },
  { question: "Sind Belohnungen garantierte Gewinne?", answer: "Nein. Admin-Konfiguration, keine garantierten autonomen KI-Gewinne." },
  { question: "Wie funktioniert das Referral-Programm?", answer: "Link teilen; Provisionen bei erfüllter Aktivität der Eingeladenen." },
];

function navBlock(locale: Locale) {
  const blocks: Record<Locale, Messages["nav"]> = {
    en: { home: "Home", howItWorks: "How It Works", aiTechnology: "AI Technology", markets: "Markets", features: "Features", faq: "FAQ", contact: "Contact" },
    es: { home: "Inicio", howItWorks: "Cómo funciona", aiTechnology: "Tecnología IA", markets: "Mercados", features: "Funciones", faq: "FAQ", contact: "Contacto" },
    fr: { home: "Accueil", howItWorks: "Comment ça marche", aiTechnology: "Technologie IA", markets: "Marchés", features: "Fonctionnalités", faq: "FAQ", contact: "Contact" },
    de: { home: "Startseite", howItWorks: "So funktioniert es", aiTechnology: "KI-Technologie", markets: "Märkte", features: "Funktionen", faq: "FAQ", contact: "Kontakt" },
  };
  return blocks[locale];
}

function headerBlock(locale: Locale) {
  const blocks: Record<Locale, Messages["header"]> = {
    en: { signIn: "Sign In", getStarted: "Get Started", dashboard: "Dashboard", admin: "Admin", balance: "Account balance", wallet: "Wallet", signInBalance: "Sign in to view balance", openMenu: "Open menu", closeMenu: "Close menu", yourAccount: "Your account" },
    es: { signIn: "Iniciar sesión", getStarted: "Comenzar", dashboard: "Panel", admin: "Admin", balance: "Saldo", wallet: "Billetera", signInBalance: "Inicie sesión para ver saldo", openMenu: "Abrir menú", closeMenu: "Cerrar menú", yourAccount: "Su cuenta" },
    fr: { signIn: "Connexion", getStarted: "Commencer", dashboard: "Tableau de bord", admin: "Admin", balance: "Solde", wallet: "Portefeuille", signInBalance: "Connectez-vous pour voir le solde", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", yourAccount: "Votre compte" },
    de: { signIn: "Anmelden", getStarted: "Loslegen", dashboard: "Dashboard", admin: "Admin", balance: "Kontostand", wallet: "Wallet", signInBalance: "Anmelden für Kontostand", openMenu: "Menü öffnen", closeMenu: "Menü schließen", yourAccount: "Ihr Konto" },
  };
  return blocks[locale];
}

function footerBlock(locale: Locale) {
  const blocks: Record<Locale, Messages["footer"]> = {
    en: { tagline: "A modern AI trading and treasury platform with configurable rewards, crypto funding, and professional dashboards.", platform: "Platform", legal: "Legal", support: "Support", howItWorks: "How it works", aiTechnology: "AI technology", features: "Features", markets: "Markets", trading: "Trading workspace", dailyTasks: "Daily tasks", terms: "Terms of service", privacy: "Privacy policy", risk: "Risk disclosure", cookies: "Cookie policy", faq: "FAQ", blog: "Blog / news", contact: "Contact", supportCenter: "Support center", openAccount: "Open account", disclaimer: "Configured rewards are not guaranteed trading profits." },
    es: { tagline: "Plataforma moderna de trading IA y tesorería con recompensas configurables y paneles profesionales.", platform: "Plataforma", legal: "Legal", support: "Soporte", howItWorks: "Cómo funciona", aiTechnology: "Tecnología IA", features: "Funciones", markets: "Mercados", trading: "Espacio de trading", dailyTasks: "Tareas diarias", terms: "Términos", privacy: "Privacidad", risk: "Riesgos", cookies: "Cookies", faq: "FAQ", blog: "Blog", contact: "Contacto", supportCenter: "Centro de soporte", openAccount: "Abrir cuenta", disclaimer: "Las recompensas configuradas no son ganancias garantizadas." },
    fr: { tagline: "Plateforme moderne de trading IA et trésorerie avec récompenses configurables.", platform: "Plateforme", legal: "Mentions légales", support: "Support", howItWorks: "Comment ça marche", aiTechnology: "Technologie IA", features: "Fonctionnalités", markets: "Marchés", trading: "Espace trading", dailyTasks: "Tâches quotidiennes", terms: "Conditions", privacy: "Confidentialité", risk: "Risques", cookies: "Cookies", faq: "FAQ", blog: "Blog", contact: "Contact", supportCenter: "Centre d'aide", openAccount: "Ouvrir un compte", disclaimer: "Les récompenses configurées ne garantissent pas des profits." },
    de: { tagline: "Moderne KI-Trading- und Treasury-Plattform mit konfigurierbaren Belohnungen.", platform: "Plattform", legal: "Rechtliches", support: "Support", howItWorks: "So funktioniert es", aiTechnology: "KI-Technologie", features: "Funktionen", markets: "Märkte", trading: "Trading-Bereich", dailyTasks: "Tägliche Aufgaben", terms: "AGB", privacy: "Datenschutz", risk: "Risikohinweis", cookies: "Cookies", faq: "FAQ", blog: "Blog", contact: "Kontakt", supportCenter: "Support-Center", openAccount: "Konto eröffnen", disclaimer: "Konfigurierte Belohnungen sind keine garantierten Gewinne." },
  };
  return blocks[locale];
}

const pageMaps: Record<Locale, Messages["pages"]> = {
  en: enPages,
  es: esPages,
  fr: frPages,
  de: dePages,
};

const faqMaps: Record<Locale, FaqItem[]> = {
  en: enFaq,
  es: esFaq,
  fr: frFaq,
  de: deFaq,
};

export function getMessages(locale: Locale): Messages {
  return {
    nav: navBlock(locale),
    header: headerBlock(locale),
    footer: footerBlock(locale),
    common: { backHome: pageMaps[locale].howItWorks.backHome ?? "← Back" },
    pages: pageMaps[locale],
    faq: faqMaps[locale],
  };
}

export const SLUG_TO_PAGE_KEY: Record<string, keyof Messages["pages"]> = {
  "how-it-works": "howItWorks",
  "ai-technology": "aiTechnology",
  features: "features",
  markets: "markets",
  faq: "faq",
  contact: "contact",
};
