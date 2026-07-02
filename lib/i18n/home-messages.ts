import type { Locale } from "@/lib/i18n/types";

export type HomeMessages = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    startTrading: string;
    learnMore: string;
    operateLabel: string;
    operateTitle: string;
    operateItems: { title: string; body: string }[];
    openTrading: string;
    howVerification: string;
    slide2Badge: string;
    slide2Title: string;
    slide2Body: string;
    register: string;
    login: string;
  };
  platform: {
    badge: string;
    title: string;
    body: string;
    startTrading: string;
    signIn: string;
    features: string[];
  };
  aiSections: {
    stats: { label: string; value: string }[];
    whyTitle: string;
    features: { title: string; body: string }[];
    techBadge: string;
    techTitle: string;
    techBody: string;
    exploreTech: string;
    testimonialsTitle: string;
    testimonials: { quote: string; name: string }[];
    ctaTitle: string;
    ctaBody: string;
    getStarted: string;
    howItWorks: string;
  };
  liveMarkets: { title: string; body: string };
  faq: { title: string; fullFaq: string };
  cta: { title: string; body: string; openAccount: string };
};

const en: HomeMessages = {
  hero: {
    badge: "AI-powered trading infrastructure",
    title: "Trade smarter with CapitalCore AI",
    subtitle:
      "Premium dashboards for crypto, forex, stocks, and commodities—plus daily tasks, earnings tracking, and admin-configured treasury rules.",
    startTrading: "Start trading",
    learnMore: "Learn more",
    operateLabel: "How we operate",
    operateTitle: "Institutional discipline, retail-ready clarity",
    operateItems: [
      { title: "Verified onboarding", body: "KYC and suitability before you fund." },
      { title: "Protected treasury", body: "2FA, devices, and a full movement history." },
      { title: "Unified workspace", body: "Markets, tasks, and balances together." },
    ],
    openTrading: "Open trading",
    howVerification: "How verification works",
    slide2Badge: "Data-driven decisions",
    slide2Title: "Professional tools for modern traders",
    slide2Body:
      "AI-assisted workflows, live charts, daily tasks, and transparent treasury controls—built for traders who want clarity without clutter.",
    register: "Register",
    login: "Login",
  },
  platform: {
    badge: "AI Trading Platform",
    title: "Your intelligent trading command center",
    body: "Trade across crypto, forex, stocks, and commodities. Complete daily tasks, track configured rewards, fund with crypto, and manage withdrawals—all from one professional dashboard.",
    startTrading: "Start trading",
    signIn: "Sign in",
    features: ["AI Dashboard", "Live Trading", "Daily Tasks", "Earnings", "Referrals", "Withdrawals"],
  },
  aiSections: {
    stats: [
      { label: "Markets supported", value: "120+" },
      { label: "Platform uptime", value: "99.9%" },
      { label: "Avg. task completion", value: "< 2 min" },
      { label: "Configurable rewards", value: "Admin-led" },
    ],
    whyTitle: "Why choose CapitalCore AI",
    features: [
      {
        title: "Rules-based automation",
        body: "Workflows and reward logic are configured by administrators—not presented as live autonomous AI trading unless backed by real execution infrastructure.",
      },
      {
        title: "Professional charts",
        body: "TradingView-powered market views with responsive layouts across mobile, tablet, and desktop.",
      },
      {
        title: "Treasury controls",
        body: "Crypto deposits, withdrawal approvals, audit trails, and role-based admin permissions.",
      },
      {
        title: "Daily engagement",
        body: "Configurable daily tasks, streak tracking, and transparent reward history.",
      },
    ],
    techBadge: "AI Technology",
    techTitle: "Intelligent workflows, transparent controls",
    techBody:
      "CapitalCore combines market data, configurable task rewards, and admin-managed treasury rules in one platform. We do not claim autonomous AI profits unless the backend genuinely supports that execution path.",
    exploreTech: "Explore AI technology",
    testimonialsTitle: "What users say",
    testimonials: [
      {
        quote: "The dashboard feels like a modern exchange—clean balances, clear activity, and fast navigation.",
        name: "Platform beta user",
      },
      {
        quote: "I appreciate that rewards and tasks are configurable. Everything is visible in one place.",
        name: "Early adopter",
      },
    ],
    ctaTitle: "Ready to open your AI trading workspace?",
    ctaBody:
      "Create an account, complete verification, fund with crypto, and access dashboards, daily tasks, and admin-managed rewards.",
    getStarted: "Get started",
    howItWorks: "How it works",
  },
  liveMarkets: {
    title: "Live markets",
    body: "Professional TradingView charts for research and execution.",
  },
  faq: { title: "Frequently asked questions", fullFaq: "Full FAQ" },
  cta: {
    title: "Ready to trade with CapitalCore AI?",
    body: "Create your account, fund your wallet, and explore markets with admin-configured rewards you can track transparently.",
    openAccount: "Open account",
  },
};

const es: HomeMessages = {
  hero: {
    badge: "Infraestructura de trading con IA",
    title: "Opere con inteligencia en CapitalCore AI",
    subtitle:
      "Paneles premium para cripto, forex, acciones y materias primas—más tareas diarias, seguimiento de ganancias y reglas de tesorería configuradas por administración.",
    startTrading: "Comenzar a operar",
    learnMore: "Saber más",
    operateLabel: "Cómo operamos",
    operateTitle: "Disciplina institucional, claridad accesible",
    operateItems: [
      { title: "Onboarding verificado", body: "KYC y idoneidad antes de depositar." },
      { title: "Tesorería protegida", body: "2FA, dispositivos e historial completo de movimientos." },
      { title: "Espacio unificado", body: "Mercados, tareas y saldos en un solo lugar." },
    ],
    openTrading: "Abrir trading",
    howVerification: "Cómo funciona la verificación",
    slide2Badge: "Decisiones basadas en datos",
    slide2Title: "Herramientas profesionales para traders modernos",
    slide2Body:
      "Flujos asistidos por IA, gráficos en vivo, tareas diarias y controles de tesorería transparentes—sin complejidad innecesaria.",
    register: "Registrarse",
    login: "Iniciar sesión",
  },
  platform: {
    badge: "Plataforma de trading IA",
    title: "Su centro de mando de trading inteligente",
    body: "Opere cripto, forex, acciones y materias primas. Complete tareas diarias, siga recompensas configuradas, deposite con cripto y gestione retiros desde un panel profesional.",
    startTrading: "Comenzar a operar",
    signIn: "Iniciar sesión",
    features: ["Panel IA", "Trading en vivo", "Tareas diarias", "Ganancias", "Referidos", "Retiros"],
  },
  aiSections: {
    stats: [
      { label: "Mercados soportados", value: "120+" },
      { label: "Disponibilidad", value: "99.9%" },
      { label: "Tarea promedio", value: "< 2 min" },
      { label: "Recompensas", value: "Admin" },
    ],
    whyTitle: "Por qué elegir CapitalCore AI",
    features: [
      {
        title: "Automatización basada en reglas",
        body: "Los flujos y recompensas los configura la administración—no se presentan como trading autónomo salvo con infraestructura real.",
      },
      {
        title: "Gráficos profesionales",
        body: "Vistas de mercado con TradingView en móvil, tablet y escritorio.",
      },
      {
        title: "Controles de tesorería",
        body: "Depósitos cripto, aprobación de retiros, auditoría y permisos admin.",
      },
      {
        title: "Compromiso diario",
        body: "Tareas configurables, rachas e historial transparente de recompensas.",
      },
    ],
    techBadge: "Tecnología IA",
    techTitle: "Flujos inteligentes, controles transparentes",
    techBody:
      "CapitalCore combina datos de mercado, recompensas configurables y reglas de tesorería administradas en una plataforma. No prometemos ganancias autónomas de IA sin ejecución real.",
    exploreTech: "Explorar tecnología IA",
    testimonialsTitle: "Lo que dicen los usuarios",
    testimonials: [
      {
        quote: "El panel se siente como un exchange moderno—saldos claros, actividad visible y navegación rápida.",
        name: "Usuario beta",
      },
      {
        quote: "Valoro que recompensas y tareas sean configurables. Todo está en un solo lugar.",
        name: "Adoptante temprano",
      },
    ],
    ctaTitle: "¿Listo para abrir su espacio de trading IA?",
    ctaBody:
      "Cree una cuenta, complete la verificación, deposite con cripto y acceda a paneles, tareas y recompensas administradas.",
    getStarted: "Comenzar",
    howItWorks: "Cómo funciona",
  },
  liveMarkets: {
    title: "Mercados en vivo",
    body: "Gráficos TradingView profesionales para investigación y ejecución.",
  },
  faq: { title: "Preguntas frecuentes", fullFaq: "FAQ completo" },
  cta: {
    title: "¿Listo para operar con CapitalCore AI?",
    body: "Cree su cuenta, deposite en su billetera y explore mercados con recompensas configuradas de forma transparente.",
    openAccount: "Abrir cuenta",
  },
};

const fr: HomeMessages = {
  hero: {
    badge: "Infrastructure de trading IA",
    title: "Tradez plus intelligemment avec CapitalCore AI",
    subtitle:
      "Tableaux de bord premium pour crypto, forex, actions et matières premières—plus tâches quotidiennes, suivi des gains et règles de trésorerie configurées.",
    startTrading: "Commencer à trader",
    learnMore: "En savoir plus",
    operateLabel: "Notre fonctionnement",
    operateTitle: "Discipline institutionnelle, clarté accessible",
    operateItems: [
      { title: "Onboarding vérifié", body: "KYC et adéquation avant tout dépôt." },
      { title: "Trésorerie protégée", body: "2FA, appareils et historique complet des mouvements." },
      { title: "Espace unifié", body: "Marchés, tâches et soldes réunis." },
    ],
    openTrading: "Ouvrir le trading",
    howVerification: "Comment fonctionne la vérification",
    slide2Badge: "Décisions basées sur les données",
    slide2Title: "Outils professionnels pour traders modernes",
    slide2Body:
      "Workflows assistés par IA, graphiques live, tâches quotidiennes et contrôles de trésorerie transparents—sans complexité inutile.",
    register: "S'inscrire",
    login: "Connexion",
  },
  platform: {
    badge: "Plateforme de trading IA",
    title: "Votre centre de commande trading intelligent",
    body: "Tradez crypto, forex, actions et matières premières. Accomplissez les tâches, suivez les récompenses, déposez en crypto et gérez les retraits depuis un tableau de bord professionnel.",
    startTrading: "Commencer à trader",
    signIn: "Connexion",
    features: ["Tableau IA", "Trading live", "Tâches quotidiennes", "Gains", "Parrainage", "Retraits"],
  },
  aiSections: {
    stats: [
      { label: "Marchés supportés", value: "120+" },
      { label: "Disponibilité", value: "99.9%" },
      { label: "Tâche moyenne", value: "< 2 min" },
      { label: "Récompenses", value: "Admin" },
    ],
    whyTitle: "Pourquoi choisir CapitalCore AI",
    features: [
      {
        title: "Automatisation par règles",
        body: "Workflows et récompenses configurés par l'administration—pas de trading autonome sans infrastructure réelle.",
      },
      {
        title: "Graphiques professionnels",
        body: "Vues marché TradingView sur mobile, tablette et bureau.",
      },
      {
        title: "Contrôles de trésorerie",
        body: "Dépôts crypto, approbation des retraits, audit et permissions admin.",
      },
      {
        title: "Engagement quotidien",
        body: "Tâches configurables, séries et historique transparent des récompenses.",
      },
    ],
    techBadge: "Technologie IA",
    techTitle: "Workflows intelligents, contrôles transparents",
    techBody:
      "CapitalCore combine données marché, récompenses configurables et règles de trésorerie admin. Pas de profits IA autonomes sans exécution réelle.",
    exploreTech: "Explorer la technologie IA",
    testimonialsTitle: "Ce que disent les utilisateurs",
    testimonials: [
      {
        quote: "Le tableau de bord ressemble à un exchange moderne—soldes clairs, activité visible, navigation rapide.",
        name: "Utilisateur bêta",
      },
      {
        quote: "J'apprécie que récompenses et tâches soient configurables. Tout est au même endroit.",
        name: "Adopteur précoce",
      },
    ],
    ctaTitle: "Prêt à ouvrir votre espace trading IA ?",
    ctaBody:
      "Créez un compte, vérifiez-vous, déposez en crypto et accédez aux tableaux de bord, tâches et récompenses admin.",
    getStarted: "Commencer",
    howItWorks: "Comment ça marche",
  },
  liveMarkets: {
    title: "Marchés en direct",
    body: "Graphiques TradingView professionnels pour recherche et exécution.",
  },
  faq: { title: "Questions fréquentes", fullFaq: "FAQ complet" },
  cta: {
    title: "Prêt à trader avec CapitalCore AI ?",
    body: "Créez votre compte, alimentez votre portefeuille et explorez les marchés avec des récompenses configurées de façon transparente.",
    openAccount: "Ouvrir un compte",
  },
};

const de: HomeMessages = {
  hero: {
    badge: "KI-gestützte Trading-Infrastruktur",
    title: "Smarter handeln mit CapitalCore AI",
    subtitle:
      "Premium-Dashboards für Krypto, Forex, Aktien und Rohstoffe—plus tägliche Aufgaben, Einnahmen-Tracking und admin-konfigurierte Treasury-Regeln.",
    startTrading: "Trading starten",
    learnMore: "Mehr erfahren",
    operateLabel: "So arbeiten wir",
    operateTitle: "Institutionelle Disziplin, klare Oberfläche",
    operateItems: [
      { title: "Verifiziertes Onboarding", body: "KYC und Eignung vor der Einzahlung." },
      { title: "Geschützte Treasury", body: "2FA, Geräte und vollständiger Bewegungsverlauf." },
      { title: "Einheitlicher Workspace", body: "Märkte, Aufgaben und Salden zusammen." },
    ],
    openTrading: "Trading öffnen",
    howVerification: "So funktioniert die Verifizierung",
    slide2Badge: "Datenbasierte Entscheidungen",
    slide2Title: "Professionelle Tools für moderne Trader",
    slide2Body:
      "KI-unterstützte Workflows, Live-Charts, tägliche Aufgaben und transparente Treasury-Kontrollen—ohne unnötige Komplexität.",
    register: "Registrieren",
    login: "Anmelden",
  },
  platform: {
    badge: "KI-Trading-Plattform",
    title: "Ihr intelligentes Trading-Kommandozentrum",
    body: "Handeln Sie Krypto, Forex, Aktien und Rohstoffe. Erledigen Sie tägliche Aufgaben, verfolgen Sie Belohnungen, zahlen Sie mit Krypto ein und verwalten Sie Auszahlungen in einem professionellen Dashboard.",
    startTrading: "Trading starten",
    signIn: "Anmelden",
    features: ["KI-Dashboard", "Live-Trading", "Tägliche Aufgaben", "Einnahmen", "Referrals", "Auszahlungen"],
  },
  aiSections: {
    stats: [
      { label: "Unterstützte Märkte", value: "120+" },
      { label: "Verfügbarkeit", value: "99.9%" },
      { label: "Durchschn. Aufgabe", value: "< 2 min" },
      { label: "Belohnungen", value: "Admin" },
    ],
    whyTitle: "Warum CapitalCore AI",
    features: [
      {
        title: "Regelbasierte Automatisierung",
        body: "Workflows und Belohnungen werden von Admins konfiguriert—kein autonomes KI-Trading ohne echte Infrastruktur.",
      },
      {
        title: "Professionelle Charts",
        body: "TradingView-Marktansichten auf Mobil, Tablet und Desktop.",
      },
      {
        title: "Treasury-Kontrollen",
        body: "Krypto-Einzahlungen, Auszahlungsfreigaben, Audit-Trails und Admin-Berechtigungen.",
      },
      {
        title: "Tägliches Engagement",
        body: "Konfigurierbare Aufgaben, Streaks und transparenter Belohnungsverlauf.",
      },
    ],
    techBadge: "KI-Technologie",
    techTitle: "Intelligente Workflows, transparente Kontrollen",
    techBody:
      "CapitalCore verbindet Marktdaten, konfigurierbare Belohnungen und admin-verwaltete Treasury-Regeln. Keine autonomen KI-Gewinne ohne echte Ausführung.",
    exploreTech: "KI-Technologie erkunden",
    testimonialsTitle: "Stimmen der Nutzer",
    testimonials: [
      {
        quote: "Das Dashboard fühlt sich wie eine moderne Börse an—klare Salden, sichtbare Aktivität, schnelle Navigation.",
        name: "Beta-Nutzer",
      },
      {
        quote: "Ich schätze, dass Belohnungen und Aufgaben konfigurierbar sind. Alles an einem Ort.",
        name: "Früher Nutzer",
      },
    ],
    ctaTitle: "Bereit für Ihren KI-Trading-Workspace?",
    ctaBody:
      "Konto erstellen, Verifizierung abschließen, mit Krypto einzahlen und Dashboards, Aufgaben und admin-Belohnungen nutzen.",
    getStarted: "Loslegen",
    howItWorks: "So funktioniert es",
  },
  liveMarkets: {
    title: "Live-Märkte",
    body: "Professionelle TradingView-Charts für Analyse und Ausführung.",
  },
  faq: { title: "Häufig gestellte Fragen", fullFaq: "Vollständige FAQ" },
  cta: {
    title: "Bereit zum Handeln mit CapitalCore AI?",
    body: "Erstellen Sie Ihr Konto, laden Sie Ihr Wallet auf und erkunden Sie Märkte mit transparent nachverfolgbaren Belohnungen.",
    openAccount: "Konto eröffnen",
  },
};

export const homeMessages: Record<Locale, HomeMessages> = { en, es, fr, de };

export function getHomeMessages(locale: Locale) {
  return homeMessages[locale];
}
