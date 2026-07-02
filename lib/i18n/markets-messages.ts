import type { Locale } from "@/lib/i18n/types";
import type { StepItem } from "@/lib/i18n/messages";

export type MarketsDetail = {
  intro1: string;
  intro2: string;
  stats: { label: string; value: string; detail: string }[];
  assetClassesTitle: string;
  assetClassesIntro: string;
  assetClasses: { name: string; summary: string; facts: string[]; openPrefix: string }[];
  howMarketsMoveTitle: string;
  howMarketsMoveP1: string;
  howMarketsMoveP2: string;
  sessionsTitle: string;
  sessionsIntro: string;
  tableHeaders: { region: string; hours: string; notes: string };
  sessions: { region: string; hours: string; focus: string }[];
  tradingTitle: string;
  steps: StepItem[];
  chartTitle: string;
  chartIntro: string;
  riskTitle: string;
  riskFacts: string[];
  ctaTitle: string;
  ctaBody: string;
  openAccount: string;
  goToTrading: string;
};

const en: MarketsDetail = {
  intro1:
    "CapitalCore markets bring crypto, forex, equities, and commodities into one workspace—so you can research, execute, and monitor without switching between disconnected tools. Prices reflect real-time supply and demand; your job is to align exposure with your risk tolerance and time horizon.",
  intro2:
    "A market is where buyers and sellers agree on price. On CapitalCore, that process is supported by live charting, transparent order history, and consolidated balances. Whether you trade actively or earn through daily tasks, the same treasury and compliance fabric applies.",
  stats: [
    { label: "Asset classes", value: "4+", detail: "Crypto · Forex · Equities · Commodities" },
    { label: "Live instruments", value: "120+", detail: "Major pairs, indices & digital assets" },
    { label: "Chart intervals", value: "1m–1W", detail: "Intraday through weekly views" },
    { label: "Settlement", value: "T+0–T+2", detail: "Varies by market and product type" },
  ],
  assetClassesTitle: "Supported asset classes",
  assetClassesIntro:
    "Each class behaves differently—session hours, volatility, and settlement rules vary. Understanding those differences is the foundation of disciplined participation.",
  assetClasses: [
    {
      name: "Cryptocurrency",
      summary:
        "Trade major digital assets with integrated wallet funding and unified reporting. Crypto markets operate 24/7, which means prices can move sharply outside traditional session hours.",
      facts: ["24/7 market access", "On-chain & card funding", "Volatility can exceed traditional assets"],
      openPrefix: "Open",
    },
    {
      name: "Forex (FX)",
      summary:
        "Participate in the world's largest market by daily volume. Currency pairs reflect macro policy, trade flows, and interest-rate differentials between economies.",
      facts: ["Major, minor & exotic pairs", "High liquidity in peak sessions", "Leverage increases gain and loss potential"],
      openPrefix: "Open",
    },
    {
      name: "Stocks & indices",
      summary:
        "Access listed equities and benchmark indices through professional charting and order workflows. Corporate earnings, sector trends, and macro data all influence price discovery.",
      facts: ["Exchange-listed instruments", "Session-based trading hours", "Dividends & corporate actions may apply"],
      openPrefix: "Open",
    },
    {
      name: "Commodities",
      summary:
        "Gold, energy, and agricultural themes offer diversification beyond traditional equities. Commodity prices often respond to supply constraints, geopolitical events, and inflation expectations.",
      facts: ["Precious metals & resources", "Inflation & hedge narratives", "Trade via live charts"],
      openPrefix: "Open",
    },
  ],
  howMarketsMoveTitle: "How markets move",
  howMarketsMoveP1:
    "Price discovery happens when orders match on an exchange or liquidity venue. The bid is the highest price buyers will pay; the ask is the lowest price sellers accept. The gap between them—the spread—reflects liquidity and transaction cost. In fast markets, spreads can widen; in deep markets, they tend to stay tight.",
  howMarketsMoveP2:
    "Volume, news, earnings, policy decisions, and macro data all shift sentiment. CapitalCore does not guarantee fills at a quoted price during extreme volatility; slippage may occur when liquidity thins. That is why position sizing and stop discipline matter as much as entry timing.",
  sessionsTitle: "Global trading sessions",
  sessionsIntro:
    "Traditional markets follow regional session hours. Overlaps—especially London and New York—often see the highest FX and equity volume. Crypto trades continuously.",
  tableHeaders: { region: "Region", hours: "Typical hours (UTC)", notes: "Notes" },
  sessions: [
    { region: "Asia-Pacific", hours: "00:00 – 09:00 UTC", focus: "Tokyo · Sydney · early liquidity" },
    { region: "Europe", hours: "07:00 – 16:00 UTC", focus: "London · Frankfurt · FX overlap" },
    { region: "Americas", hours: "13:30 – 21:00 UTC", focus: "New York · highest equity volume" },
    { region: "Crypto", hours: "24 / 7", focus: "Continuous; weekend gaps rare" },
  ],
  tradingTitle: "How trading works on CapitalCore",
  steps: [
    {
      step: "01",
      title: "Fund your account",
      body: "Deposit via cryptocurrency. Verified balances appear in your wallet and are available for trading and daily tasks.",
    },
    {
      step: "02",
      title: "Research & analyze",
      body: "Use live charts, interval switching, and watchlists to understand price action. Review suitability disclosures before committing capital.",
    },
    {
      step: "03",
      title: "Execute with discipline",
      body: "Place orders through the trading workspace or run AI-assisted trades where enabled. Every movement is logged for audit and reporting.",
    },
    {
      step: "04",
      title: "Monitor & rebalance",
      body: "Track PnL, exposure, and recent activity from your dashboard. Adjust allocations when macro conditions or personal goals change.",
    },
  ],
  chartTitle: "Live market chart",
  chartIntro:
    "Preview real-time candlestick data below. Signed-in users can open the full trading workspace with symbol search, intervals, and watchlists.",
  riskTitle: "Important risk facts",
  riskFacts: [
    "All trading involves risk of loss. Past performance does not guarantee future results.",
    "Leveraged or margin products can amplify losses beyond your initial deposit.",
    "Crypto and commodity markets may gap or halt liquidity during extreme volatility.",
    "Regulatory treatment varies by jurisdiction—confirm product eligibility before you trade.",
    "CapitalCore surfaces fees and platform rules upfront; read disclosures carefully before you trade.",
  ],
  ctaTitle: "Ready to explore markets?",
  ctaBody: "Create an account, complete verification, and access live charts and treasury tools in one place.",
  openAccount: "Open account",
  goToTrading: "Go to trading",
};

const es: MarketsDetail = {
  intro1:
    "Los mercados de CapitalCore reúnen cripto, forex, acciones y materias primas en un solo espacio para investigar, ejecutar y monitorear sin cambiar de herramienta. Los precios reflejan oferta y demanda en tiempo real; su tarea es alinear la exposición con su tolerancia al riesgo.",
  intro2:
    "Un mercado es donde compradores y vendedores acuerdan el precio. En CapitalCore, el proceso se apoya en gráficos en vivo, historial transparente de órdenes y saldos consolidados. Ya opere activamente o gane con tareas diarias, la misma tesorería y cumplimiento aplican.",
  stats: [
    { label: "Clases de activos", value: "4+", detail: "Cripto · Forex · Acciones · Materias primas" },
    { label: "Instrumentos en vivo", value: "120+", detail: "Pares principales, índices y activos digitales" },
    { label: "Intervalos de gráfico", value: "1m–1S", detail: "Intradía hasta vistas semanales" },
    { label: "Liquidación", value: "T+0–T+2", detail: "Varía según mercado y producto" },
  ],
  assetClassesTitle: "Clases de activos soportadas",
  assetClassesIntro:
    "Cada clase se comporta distinto—horarios, volatilidad y reglas de liquidación varían. Entender esas diferencias es la base de una participación disciplinada.",
  assetClasses: [
    {
      name: "Criptomonedas",
      summary:
        "Opere activos digitales principales con financiamiento integrado en billetera. Los mercados cripto operan 24/7 y los precios pueden moverse bruscamente fuera de horarios tradicionales.",
      facts: ["Acceso 24/7", "Financiamiento on-chain", "Volatilidad superior a activos tradicionales"],
      openPrefix: "Abrir",
    },
    {
      name: "Forex (FX)",
      summary:
        "Participe en el mercado más grande por volumen diario. Los pares reflejan política macro, flujos comerciales y diferenciales de tipos de interés.",
      facts: ["Pares mayores, menores y exóticos", "Alta liquidez en sesiones pico", "El apalancamiento amplifica ganancias y pérdidas"],
      openPrefix: "Abrir",
    },
    {
      name: "Acciones e índices",
      summary:
        "Acceda a acciones listadas e índices de referencia con gráficos profesionales. Resultados corporativos, sectores y datos macro influyen en el precio.",
      facts: ["Instrumentos en bolsa", "Horarios por sesión", "Dividendos y acciones corporativas pueden aplicar"],
      openPrefix: "Abrir",
    },
    {
      name: "Materias primas",
      summary:
        "Oro, energía y agricultura ofrecen diversificación. Los precios responden a oferta, eventos geopolíticos e inflación.",
      facts: ["Metales y recursos", "Narrativas de cobertura", "Opere con gráficos en vivo"],
      openPrefix: "Abrir",
    },
  ],
  howMarketsMoveTitle: "Cómo se mueven los mercados",
  howMarketsMoveP1:
    "El descubrimiento de precios ocurre cuando las órdenes coinciden. La oferta es el precio máximo que pagan compradores; la demanda el mínimo que aceptan vendedores. El spread refleja liquidez y costo. En mercados rápidos el spread puede ampliarse.",
  howMarketsMoveP2:
    "Volumen, noticias, resultados y datos macro cambian el sentimiento. CapitalCore no garantiza ejecución a precio cotizado en volatilidad extrema; puede haber deslizamiento. El tamaño de posición y la disciplina importan tanto como el timing.",
  sessionsTitle: "Sesiones globales de trading",
  sessionsIntro:
    "Los mercados tradicionales siguen horarios regionales. Los solapamientos Londres-Nueva York suelen tener el mayor volumen FX y accionario. Cripto opera continuamente.",
  tableHeaders: { region: "Región", hours: "Horario típico (UTC)", notes: "Notas" },
  sessions: [
    { region: "Asia-Pacífico", hours: "00:00 – 09:00 UTC", focus: "Tokio · Sídney · liquidez temprana" },
    { region: "Europa", hours: "07:00 – 16:00 UTC", focus: "Londres · Frankfurt · solapamiento FX" },
    { region: "Américas", hours: "13:30 – 21:00 UTC", focus: "Nueva York · mayor volumen accionario" },
    { region: "Cripto", hours: "24 / 7", focus: "Continuo; gaps de fin de semana raros" },
  ],
  tradingTitle: "Cómo funciona el trading en CapitalCore",
  steps: [
    { step: "01", title: "Financie su cuenta", body: "Deposite cripto. Los saldos verificados aparecen en su billetera para trading y tareas." },
    { step: "02", title: "Investigue y analice", body: "Use gráficos en vivo, intervalos y listas de seguimiento. Revise divulgaciones antes de comprometer capital." },
    { step: "03", title: "Ejecute con disciplina", body: "Coloque órdenes en el espacio de trading o use trades asistidos por IA. Cada movimiento queda registrado." },
    { step: "04", title: "Monitoree y rebalancee", body: "Siga PnL, exposición y actividad desde su panel. Ajuste cuando cambien condiciones o metas." },
  ],
  chartTitle: "Gráfico de mercado en vivo",
  chartIntro:
    "Vista previa de velas en tiempo real. Los usuarios registrados acceden al espacio completo con búsqueda de símbolos e intervalos.",
  riskTitle: "Hechos de riesgo importantes",
  riskFacts: [
    "Todo trading implica riesgo de pérdida. El rendimiento pasado no garantiza resultados futuros.",
    "Productos apalancados pueden amplificar pérdidas más allá del depósito inicial.",
    "Cripto y materias primas pueden tener gaps o liquidez reducida en volatilidad extrema.",
    "El tratamiento regulatorio varía por jurisdicción—confirme elegibilidad antes de operar.",
    "CapitalCore muestra comisiones y reglas por adelantado; lea las divulgaciones con cuidado.",
  ],
  ctaTitle: "¿Listo para explorar mercados?",
  ctaBody: "Cree una cuenta, complete la verificación y acceda a gráficos en vivo y herramientas de tesorería.",
  openAccount: "Abrir cuenta",
  goToTrading: "Ir a trading",
};

const fr: MarketsDetail = {
  intro1:
    "Les marchés CapitalCore regroupent crypto, forex, actions et matières premières dans un espace unique pour rechercher, exécuter et surveiller sans changer d'outil. Les prix reflètent l'offre et la demande en temps réel.",
  intro2:
    "Un marché est l'endroit où acheteurs et vendeurs s'accordent sur le prix. CapitalCore s'appuie sur des graphiques live, un historique transparent des ordres et des soldes consolidés.",
  stats: [
    { label: "Classes d'actifs", value: "4+", detail: "Crypto · Forex · Actions · Matières premières" },
    { label: "Instruments live", value: "120+", detail: "Paires majeures, indices et actifs numériques" },
    { label: "Intervalles", value: "1m–1S", detail: "Intraday à hebdomadaire" },
    { label: "Règlement", value: "T+0–T+2", detail: "Varie selon marché et produit" },
  ],
  assetClassesTitle: "Classes d'actifs supportées",
  assetClassesIntro:
    "Chaque classe se comporte différemment—horaires, volatilité et règles de règlement varient. Comprendre ces différences est la base d'une participation disciplinée.",
  assetClasses: [
    {
      name: "Cryptomonnaies",
      summary: "Tradez les principaux actifs numériques avec financement intégré. Les marchés crypto fonctionnent 24/7.",
      facts: ["Accès 24/7", "Financement on-chain", "Volatilité supérieure aux actifs traditionnels"],
      openPrefix: "Ouvrir",
    },
    {
      name: "Forex (FX)",
      summary: "Participez au plus grand marché par volume quotidien. Les paires reflètent politique macro et taux d'intérêt.",
      facts: ["Paires majeures, mineures et exotiques", "Forte liquidité aux heures de pointe", "L'effet de levier amplifie gains et pertes"],
      openPrefix: "Ouvrir",
    },
    {
      name: "Actions et indices",
      summary: "Accédez aux actions cotées et indices de référence avec graphiques professionnels.",
      facts: ["Instruments cotés", "Heures de session", "Dividendes et opérations sur titres possibles"],
      openPrefix: "Ouvrir",
    },
    {
      name: "Matières premières",
      summary: "Or, énergie et agriculture offrent une diversification au-delà des actions traditionnelles.",
      facts: ["Métaux et ressources", "Couverture inflation", "Tradez via graphiques live"],
      openPrefix: "Ouvrir",
    },
  ],
  howMarketsMoveTitle: "Comment les marchés bougent",
  howMarketsMoveP1:
    "La découverte de prix a lieu quand les ordres correspondent. Le bid est le prix max des acheteurs ; l'ask le min des vendeurs. L'écart—le spread—reflète liquidité et coût.",
  howMarketsMoveP2:
    "Volume, actualités, résultats et données macro modifient le sentiment. CapitalCore ne garantit pas l'exécution au prix coté en volatilité extrême ; le slippage peut survenir.",
  sessionsTitle: "Sessions de trading mondiales",
  sessionsIntro:
    "Les marchés traditionnels suivent des horaires régionaux. Les chevauchements Londres-New York voient souvent le plus grand volume FX et actions. La crypto trade en continu.",
  tableHeaders: { region: "Région", hours: "Heures typiques (UTC)", notes: "Notes" },
  sessions: [
    { region: "Asie-Pacifique", hours: "00:00 – 09:00 UTC", focus: "Tokyo · Sydney · liquidité matinale" },
    { region: "Europe", hours: "07:00 – 16:00 UTC", focus: "Londres · Francfort · chevauchement FX" },
    { region: "Amériques", hours: "13:30 – 21:00 UTC", focus: "New York · plus grand volume actions" },
    { region: "Crypto", hours: "24 / 7", focus: "Continu ; gaps week-end rares" },
  ],
  tradingTitle: "Comment trader sur CapitalCore",
  steps: [
    { step: "01", title: "Alimentez votre compte", body: "Déposez en crypto. Les soldes vérifiés apparaissent dans votre portefeuille." },
    { step: "02", title: "Recherchez et analysez", body: "Utilisez graphiques live, intervalles et watchlists. Lisez les divulgations avant d'engager du capital." },
    { step: "03", title: "Exécutez avec discipline", body: "Passez des ordres ou utilisez le trading assisté par IA. Chaque mouvement est journalisé." },
    { step: "04", title: "Surveillez et rééquilibrez", body: "Suivez PnL, exposition et activité depuis votre tableau de bord." },
  ],
  chartTitle: "Graphique de marché live",
  chartIntro: "Aperçu des chandeliers en temps réel. Les utilisateurs connectés accèdent à l'espace trading complet.",
  riskTitle: "Faits de risque importants",
  riskFacts: [
    "Tout trading comporte un risque de perte. Les performances passées ne garantissent pas les résultats futurs.",
    "Les produits à effet de levier peuvent amplifier les pertes au-delà du dépôt initial.",
    "Crypto et matières premières peuvent manquer de liquidité en volatilité extrême.",
    "Le traitement réglementaire varie selon la juridiction.",
    "CapitalCore affiche frais et règles à l'avance ; lisez les divulgations attentivement.",
  ],
  ctaTitle: "Prêt à explorer les marchés ?",
  ctaBody: "Créez un compte, vérifiez-vous et accédez aux graphiques live et outils de trésorerie.",
  openAccount: "Ouvrir un compte",
  goToTrading: "Aller au trading",
};

const de: MarketsDetail = {
  intro1:
    "CapitalCore-Märkte vereinen Krypto, Forex, Aktien und Rohstoffe in einem Workspace—für Recherche, Ausführung und Monitoring ohne Tool-Wechsel. Preise spiegeln Echtzeit-Angebot und Nachfrage wider.",
  intro2:
    "Ein Markt ist der Ort, an dem Käufer und Verkäufer sich auf den Preis einigen. CapitalCore unterstützt dies mit Live-Charts, transparentem Orderverlauf und konsolidierten Salden.",
  stats: [
    { label: "Anlageklassen", value: "4+", detail: "Krypto · Forex · Aktien · Rohstoffe" },
    { label: "Live-Instrumente", value: "120+", detail: "Hauptpaare, Indizes & digitale Assets" },
    { label: "Chart-Intervalle", value: "1m–1W", detail: "Intraday bis wöchentlich" },
    { label: "Abwicklung", value: "T+0–T+2", detail: "Variiert nach Markt und Produkt" },
  ],
  assetClassesTitle: "Unterstützte Anlageklassen",
  assetClassesIntro:
    "Jede Klasse verhält sich anders—Handelszeiten, Volatilität und Abwicklungsregeln variieren. Diese Unterschiede zu verstehen ist die Basis disziplinierter Teilnahme.",
  assetClasses: [
    {
      name: "Kryptowährungen",
      summary: "Handeln Sie digitale Assets mit integrierter Wallet-Finanzierung. Krypto-Märkte laufen 24/7.",
      facts: ["24/7 Zugang", "On-Chain-Finanzierung", "Volatilität über traditionelle Assets"],
      openPrefix: "Öffnen",
    },
    {
      name: "Forex (FX)",
      summary: "Der größte Markt nach Tagesvolumen. Währungspaare spiegeln Makropolitik und Zinsdifferenziale wider.",
      facts: ["Major-, Minor- & Exotic-Paare", "Hohe Liquidität in Spitzensessions", "Hebel verstärkt Gewinne und Verluste"],
      openPrefix: "Öffnen",
    },
    {
      name: "Aktien & Indizes",
      summary: "Zugang zu börsennotierten Aktien und Benchmark-Indizes mit professionellen Charts.",
      facts: ["Börsennotierte Instrumente", "Session-basierte Handelszeiten", "Dividenden & Corporate Actions möglich"],
      openPrefix: "Öffnen",
    },
    {
      name: "Rohstoffe",
      summary: "Gold, Energie und Agrar bieten Diversifikation jenseits traditioneller Aktien.",
      facts: ["Edelmetalle & Ressourcen", "Inflations- & Hedge-Narrative", "Handel via Live-Charts"],
      openPrefix: "Öffnen",
    },
  ],
  howMarketsMoveTitle: "Wie Märkte sich bewegen",
  howMarketsMoveP1:
    "Preisfindung erfolgt, wenn Orders zusammenpassen. Bid ist der höchste Käuferpreis; Ask der niedrigste Verkäuferpreis. Der Spread spiegelt Liquidität und Transaktionskosten wider.",
  howMarketsMoveP2:
    "Volumen, News, Ergebnisse und Makrodaten verschieben die Stimmung. CapitalCore garantiert keine Ausführung zum angezeigten Preis bei extremer Volatilität; Slippage ist möglich.",
  sessionsTitle: "Globale Handelssessions",
  sessionsIntro:
    "Traditionelle Märkte folgen regionalen Zeiten. Überlappungen London-New York haben oft das höchste FX- und Aktienvolumen. Krypto handelt durchgehend.",
  tableHeaders: { region: "Region", hours: "Typische Zeiten (UTC)", notes: "Hinweise" },
  sessions: [
    { region: "Asien-Pazifik", hours: "00:00 – 09:00 UTC", focus: "Tokio · Sydney · frühe Liquidität" },
    { region: "Europa", hours: "07:00 – 16:00 UTC", focus: "London · Frankfurt · FX-Overlap" },
    { region: "Amerika", hours: "13:30 – 21:00 UTC", focus: "New York · höchstes Aktienvolumen" },
    { region: "Krypto", hours: "24 / 7", focus: "Durchgehend; Wochenend-Gaps selten" },
  ],
  tradingTitle: "So funktioniert Trading auf CapitalCore",
  steps: [
    { step: "01", title: "Konto finanzieren", body: "Krypto einzahlen. Verifizierte Salden erscheinen in Ihrer Wallet für Trading und Aufgaben." },
    { step: "02", title: "Recherchieren & analysieren", body: "Live-Charts, Intervalle und Watchlists nutzen. Offenlegungen vor Kapitalbindung lesen." },
    { step: "03", title: "Diszipliniert ausführen", body: "Orders im Trading-Bereich oder KI-unterstützte Trades. Jede Bewegung wird protokolliert." },
    { step: "04", title: "Überwachen & rebalancieren", body: "PnL, Exposure und Aktivität im Dashboard verfolgen." },
  ],
  chartTitle: "Live-Marktchart",
  chartIntro: "Echtzeit-Kerzen unten. Angemeldete Nutzer öffnen den vollen Trading-Bereich mit Symbolsuche.",
  riskTitle: "Wichtige Risikofakten",
  riskFacts: [
    "Jedes Trading birgt Verlustrisiko. Vergangene Performance garantiert keine zukünftigen Ergebnisse.",
    "Hebelprodukte können Verluste über die Ersteinzahlung hinaus verstärken.",
    "Krypto- und Rohstoffmärkte können bei extremer Volatilität illiquide werden.",
    "Regulatorische Behandlung variiert je nach Jurisdiktion.",
    "CapitalCore zeigt Gebühren und Regeln im Voraus—Offenlegungen sorgfältig lesen.",
  ],
  ctaTitle: "Bereit, Märkte zu erkunden?",
  ctaBody: "Konto erstellen, Verifizierung abschließen und Live-Charts sowie Treasury-Tools nutzen.",
  openAccount: "Konto eröffnen",
  goToTrading: "Zum Trading",
};

export const marketsDetail: Record<Locale, MarketsDetail> = { en, es, fr, de };

export function getMarketsDetail(locale: Locale) {
  return marketsDetail[locale];
}
