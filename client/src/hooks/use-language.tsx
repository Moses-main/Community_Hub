import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";

type Language = "en" | "es" | "fr" | "pt" | "de" | "zh" | "ar" | "hi" | "yo";

interface Translations {
  [key: string]: string;
}

interface UserPreferences {
  preferredLanguage: Language;
  timezone: string;
  currency: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  supportedTimezones: string[];
  supportedCurrencies: string[];
}

const translations: Record<Language, Translations> = {
  en: {
    welcome: "Welcome to CHub",
    home: "Home",
    sermons: "Sermons",
    events: "Events",
    prayer: "Prayer",
    devotionals: "Devotionals",
    give: "Give",
    live: "Live",
    volunteer: "Volunteer",
    music: "Music",
    bible: "Bible Study",
    discipleship: "Discipleship",
    groups: "Groups",
    houseCells: "House Cells",
    media: "Media",
    community: "Community",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    admin: "Admin",
    members: "Members",
    attendance: "Attendance",
    analytics: "Analytics",
    messages: "Messages",
    profile: "Profile",
    settings: "Settings",
    search: "Search...",
    learnMore: "Learn More",
    serviceTimes: "Service Times",
    sundayService: "Sunday Service",
    wednesdayService: "Wednesday Service",
    fridayService: "Friday Service",
    location: "Location",
    contactUs: "Contact Us",
    aboutUs: "About Us",
    recentSermons: "Recent Sermons",
    upcomingEvents: "Upcoming Events",
    prayerRequests: "Prayer Requests",
    donate: "Donate",
    watchLive: "Watch Live",
    joinNow: "Join Now",
    readMore: "Read More",
    viewAll: "View All",
    viewAllEvents: "View All Events",
    viewPastEvents: "View Past Events",
    joinUsForFellowship: "Join us for fellowship and growth",
    noEvents: "No upcoming events",
    noSermons: "No sermons available",
    getStarted: "Get Started",
    myDashboard: "My Dashboard",
    adminDashboard: "Admin Dashboard",
    myAttendance: "My Attendance",
    privacy: "Privacy",
    signOut: "Sign out",
    loginToJoin: "Login to Join",
  },
  es: {
    welcome: "Bienvenido a Welcome to CHub",
    home: "Inicio",
    sermons: "Predicas",
    events: "Eventos",
    prayer: "Oracion",
    devotionals: "Devocionales",
    give: "Dar",
    live: "En Vivo",
    volunteer: "Voluntario",
    music: "Musica",
    bible: "Estudio Biblico",
    discipleship: "Discipulado",
    groups: "Grupos",
    houseCells: "Casas de Oracion",
    media: "Media",
    community: "Comunidad",
    login: "Iniciar Sesion",
    logout: "Cerrar Sesion",
    dashboard: "Panel",
    admin: "Admin",
    members: "Miembros",
    attendance: "Asistencia",
    analytics: "Analiticas",
    messages: "Mensajes",
    profile: "Perfil",
    settings: "Configuracion",
    search: "Buscar...",
    learnMore: "Saber Mas",
    serviceTimes: "Horarios de Servicio",
    sundayService: "Servicio del Domingo",
    wednesdayService: "Servicio del Miercoles",
    fridayService: "Servicio del Viernes",
    location: "Ubicacion",
    contactUs: "Contactenos",
    aboutUs: "Sobre Nosotros",
    recentSermons: "Predicas Recientes",
    upcomingEvents: "Proximos Eventos",
    prayerRequests: "Solicitudes de Oracion",
    donate: "Donar",
    watchLive: "Ver En Vivo",
    joinNow: "Unete Ahora",
    readMore: "Leer Mas",
    viewAll: "Ver Todo",
    viewAllEvents: "Ver Todos los Eventos",
    viewPastEvents: "Ver Eventos Pasados",
    joinUsForFellowship: "Unete a nosotros para comunion y crecimiento",
    noEvents: "No hay eventos proximos",
    noSermons: "No hay predicas disponibles",
    getStarted: "Comenzar",
    myDashboard: "Mi Panel",
    adminDashboard: "Panel de Admin",
    myAttendance: "Mi Asistencia",
    privacy: "Privacidad",
    signOut: "Cerrar Sesion",
    loginToJoin: "Iniciar Sesion para Unirse",
  },
  fr: {
    welcome: "Bienvenue a Welcome to CHub",
    home: "Accueil",
    sermons: "Predications",
    events: "Evenements",
    prayer: "Priere",
    devotionals: "Devotions",
    give: "Donner",
    live: "En Direct",
    music: "Musique",
    bible: "Etude Biblique",
    discipleship: "Discipulat",
    login: "Connexion",
    logout: "Deconnexion",
    dashboard: "Tableau de Bord",
    admin: "Admin",
    members: "Membres",
    attendance: "Presence",
    analytics: "Analytiques",
    messages: "Messages",
    profile: "Profil",
    settings: "Parametres",
    search: "Rechercher...",
    learnMore: "En Savoir Plus",
    serviceTimes: "Horaires des Services",
    sundayService: "Service de Dimanche",
    wednesdayService: "Service de Mercredi",
    location: "Emplacement",
    contactUs: "Contactez-nous",
    aboutUs: "A Propos",
    recentSermons: "Predications Recentes",
    upcomingEvents: "Evenements a Venir",
    prayerRequests: "Demandes de Priere",
    donate: "Faire un Don",
    watchLive: "Regarder en Direct",
joinNow: "Rejoignez Maintenant",
    readMore: "Lire Plus",
    viewAll: "Voir Tout",
    viewAllEvents: "Voir Tous les Evenements",
    viewPastEvents: "Voir les Evenements Passes",
    joinUsForFellowship: "Rejoignez-nous pour communion et croissance",
    noEvents: "Pas d'evenements a venir",
    noSermons: "Aucune predication disponible",
  },
  pt: {
    welcome: "Bem-vindo ao Welcome to CHub",
    home: "Inicio",
    sermons: "Pregacoes",
    events: "Eventos",
    prayer: "Oracao",
    devotionals: "Devocionais",
    give: "Doar",
    live: "Ao Vivo",
    music: "Musica",
    bible: "Estudo Biblico",
    discipleship: "Discipulado",
    login: "Entrar",
    logout: "Sair",
    dashboard: "Painel",
    admin: "Admin",
    members: "Membros",
    attendance: "Presenca",
    analytics: "Analiticos",
    messages: "Mensagens",
    profile: "Perfil",
    settings: "Configuracoes",
    search: "Pesquisar...",
    learnMore: "Saiba Mais",
    serviceTimes: "Horarios de Servico",
    sundayService: "Culto de Domingo",
    wednesdayService: "Culto de Quarta",
    location: "Localizacao",
    contactUs: "Fale Conosco",
    aboutUs: "Sobre Nos",
    recentSermons: "Pregacoes Recentes",
    upcomingEvents: "Proximos Eventos",
    prayerRequests: "Pedidos de Oracao",
    donate: "Doar",
    watchLive: "Assistir ao Vivo",
joinNow: "Participe Agora",
    readMore: "Ler Mais",
    viewAll: "Ver Tudo",
    viewAllEvents: "Ver Todos os Eventos",
    viewPastEvents: "Ver Eventos Passados",
    joinUsForFellowship: "Participe da nossa comunhao e crescimento",
    noEvents: "Nenhum evento proximo",
    noSermons: "Nenhuma pregacao disponivel",
  },
  de: {
    welcome: "Willkommen bei Welcome to CHub",
    home: "Startseite",
    sermons: "Predigten",
    events: "Veranstaltungen",
    prayer: "Gebet",
    devotionals: "Andachten",
    give: "Geben",
    live: "Live",
    music: "Musik",
    bible: "Bibelsudium",
    discipleship: "Jüngerschaft",
    login: "Anmelden",
    logout: "Abmelden",
    dashboard: "Dashboard",
    admin: "Admin",
    members: "Mitglieder",
    attendance: "Teilnahme",
    analytics: "Analytik",
    messages: "Nachrichten",
    profile: "Profil",
    settings: "Einstellungen",
    search: "Suchen...",
    learnMore: "Mehr Erfahren",
    serviceTimes: "Gottesdienstzeiten",
    sundayService: "Sonntagsgottesdienst",
    wednesdayService: "Mittwochsgottesdienst",
    location: "Standort",
    contactUs: "Kontaktieren Sie Uns",
    aboutUs: "Uber Uns",
    recentSermons: "Aktuelle Predigten",
    upcomingEvents: "Kommende Veranstaltungen",
    prayerRequests: "Gebetsanfragen",
    donate: "Spenden",
    watchLive: "Live Ansehen",
joinNow: "Jetzt Teilnehmen",
    readMore: "Mehr Lesen",
    viewAll: "Alle Ansehen",
    viewAllEvents: "Alle Veranstaltungen Ansehen",
    viewPastEvents: "Vergangene Veranstaltungen Ansehen",
    joinUsForFellowship: "Schliessen Sie sich uns an fuer Gemeinschaft und Wachstum",
    noEvents: "Keine anstehenden Veranstaltungen",
    noSermons: "Keine Predigten verfuegbar",
  },
  zh: {
    welcome: "欢迎来到CHub",
    home: "首页",
    sermons: "讲道",
    events: "活动",
    prayer: "祷告",
    devotionals: "灵修",
    give: "奉献",
    live: "直播",
    music: "音乐",
    bible: "圣经学习",
    discipleship: "门徒训练",
    login: "登录",
    logout: "退出",
    dashboard: "仪表板",
    admin: "管理",
    members: "成员",
    attendance: "出席",
    analytics: "分析",
    messages: "消息",
    profile: "个人资料",
    settings: "设置",
    search: "搜索...",
    learnMore: "了解更多",
    serviceTimes: "聚会时间",
    sundayService: "主日崇拜",
    wednesdayService: "周三聚会",
    location: "地点",
    contactUs: "联系我们",
    aboutUs: "关于我们",
    recentSermons: "最近讲道",
    upcomingEvents: "即将举行的活动",
    prayerRequests: "祷告请求",
    donate: "奉献",
    watchLive: "观看直播",
joinNow: "立即参加",
    readMore: "阅读更多",
    viewAll: "查看全部",
    viewAllEvents: "查看所有活动",
    viewPastEvents: "查看过去的活动",
    joinUsForFellowship: "加入我们一起团契和成长",
    noEvents: "没有即将举行的活动",
    noSermons: "没有可用的讲道",
  },
  ar: {
    welcome: "مرحبا بك في CHub",
    home: "الرئيسية",
    sermons: "عظات",
    events: "احداث",
    prayer: "صلاة",
    devotionals: "تاملات",
    give: "اعطاء",
    live: "بث مباشر",
    music: "موسيقى",
    bible: "دراسة الكتاب المقدس",
    discipleship: "التلمذة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    admin: "مدير",
    members: "اعضاء",
    attendance: "الحضور",
    analytics: "تحليلات",
    messages: "رسائل",
    profile: "الملف الشخصي",
    settings: "الاعدادات",
    search: "بحث...",
    learnMore: "اعرف المزيد",
    serviceTimes: "اوقات العبادة",
    sundayService: "خدمة الاحد",
    wednesdayService: "خدمة الاربعاء",
    location: "الموقع",
    contactUs: "اتصل بنا",
    aboutUs: "من نحن",
    recentSermons: "العظات الاخيرة",
    upcomingEvents: "الاحداث القادمة",
    prayerRequests: "طلبات الصلاة",
    donate: "تبرع",
    watchLive: "شاهد البث المباشر",
joinNow: "انضم الان",
    readMore: "اقرأ المزيد",
    viewAll: "عرض الكل",
    viewAllEvents: "عرض كل الاحداث",
    viewPastEvents: "عرض الاحداث السابقة",
    joinUsForFellowship: "انضم الينا للعبادة والنمو",
    noEvents: "لا توجد احداث قادمة",
    noSermons: "لا توجد عظات متاحة",
  },
  hi: {
    welcome: "CHub में आपका स्वागत है",
    home: "होम",
    sermons: "प्रचार",
    events: "कार्यक्रम",
    prayer: "प्रार्थना",
    devotionals: "आध्यात्मिक",
    give: "दान",
    live: "लाइव",
    music: "संगीत",
    bible: "बाइबल अध्ययन",
    discipleship: "शिष्यता",
    login: "लॉग इन",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    admin: "एडमिन",
    members: "सदस्य",
    attendance: "उपस्थिति",
    analytics: "विश्लेषण",
    messages: "संदेश",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    search: "खोजें...",
    learnMore: "और जानें",
    serviceTimes: "सेवा समय",
    sundayService: "रविवार सेवा",
    wednesdayService: "बुधवार सेवा",
    location: "स्थान",
    contactUs: "संपर्क करें",
    aboutUs: "हमारे बारे में",
    recentSermons: "हाल के प्रचार",
    upcomingEvents: "आगामी कार्यक्रम",
    prayerRequests: "प्रार्थना अनुरोध",
    donate: "दान करें",
    watchLive: "लाइव देखें",
joinNow: "अभी शामिल हों",
    readMore: "और पढ़ें",
    viewAll: "सभी देखें",
    viewAllEvents: "सभी कार्यक्रम देखें",
    viewPastEvents: "पिछले कार्यक्रम देखें",
    joinUsForFellowship: "हमारे साथ भागीदारी और विकास के लिए शामिल हों",
    noEvents: "कोई आगामी कार्यक्रम नहीं",
    noSermons: "कोई प्रचार उपलब्ध नहीं",
  },
  yo: {
    welcome: "Káàbọ̀ àwọn Welcome to CHub",
    home: "Ìbẹ̀rẹ̀",
    sermons: "Ọ̀rọ̀",
    events: "Ìdàje",
    prayer: "Ọ̀rọ̀ Àlàáyé",
    devotionals: "Ìwúyí",
    give: "Fún",
    live: "Lálà",
    music: "Oro",
    bible: "Iwe Mimo",
    discipleship: "Ọ̀runmìlá",
    login: "Ìwọlé",
    logout: "Ìpadà",
    dashboard: "Ọ̀pá",
    admin: "Oníṣàkóso",
    members: "Àwọn ọmọ́ ìjọ́",
    attendance: "Ọ̀pọ̀lọ́pọ̀",
    analytics: "Ìkójú",
    messages: "Ọ̀rọ̀",
    profile: "Àpẹẹrẹ",
    settings: "Ètò",
    search: "Wádìí...",
    learnMore: "Kọ́ Másè",
    serviceTimes: "Àkókò ìsìn",
    sundayService: "Ìsìn Ọ̀sẹ̀",
    wednesdayService: "Ìsìn Ọ̀jọ̀ Ọ̀tún",
    location: "Ìpèsi",
    contactUs: "Pe wa",
    aboutUs: "Nípa wa",
    recentSermons: "Ọ̀rọ̀ tí a kọ́ tẹ́lẹ̀",
    upcomingEvents: "Ìdàje tí ó padà sí",
    prayerRequests: "Ìdá píọ̀rọ̀ Àlàáyé",
    donate: "Ìdójú",
    watchLive: "Wo Lálà",
joinNow: "Jo Ọ̀dọ́",
    readMore: "Ka Púpọ̀",
    viewAll: "Wo Gbogbo",
    viewAllEvents: "Wo Gbogbo Ìdàje",
    viewPastEvents: "Wo Ìdàje Àtijọ́",
    joinUsForFellowship: "Jo wa fun ìdàje ati ìgbéga",
    noEvents: "Ko sí ìdàje kan",
    noSermons: "Ko sí ọ̀rọ̀ kan",
  },
};

const languages = [
  { code: "en" as Language, name: "English", nativeName: "English" },
  { code: "es" as Language, name: "Spanish", nativeName: "Espanol" },
  { code: "fr" as Language, name: "French", nativeName: "Francais" },
  { code: "pt" as Language, name: "Portuguese", nativeName: "Portugues" },
  { code: "de" as Language, name: "German", nativeName: "Deutsch" },
  { code: "zh" as Language, name: "Chinese", nativeName: "中文" },
  { code: "ar" as Language, name: "Arabic", nativeName: "العربية" },
  { code: "hi" as Language, name: "Hindi", nativeName: "हिन्दी" },
  { code: "yo" as Language, name: "Yoruba", nativeName: "Yoruba" },
];

const supportedTimezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

const supportedCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "NGN",
  "KES",
  "ZAR",
  "BRL",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "INR",
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredLanguage: "en",
    timezone: "UTC",
    currency: "USD",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
    
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserPreferences();
    }
  }, [isLoggedIn]);

  const fetchUserPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/preferences/language", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        if (data.preferredLanguage && translations[data.preferredLanguage as Language]) {
          setLanguageState(data.preferredLanguage as Language);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/preferences/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prefs),
      });
      if (response.ok) {
        const updated = await response.json();
        setPreferences(updated);
        if (updated.preferredLanguage && translations[updated.preferredLanguage as Language]) {
          setLanguageState(updated.preferredLanguage as Language);
        }
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  };

  const t = useCallback((key: string): string => {
    const langTranslations = translations[language];
    const result = langTranslations?.[key] || translations.en?.[key] || key;
    return result;
  }, [language]);

  const value = useMemo(() => ({ 
    language, 
    setLanguage, 
    t, 
    languages, 
    preferences,
    updatePreferences,
    supportedTimezones,
    supportedCurrencies,
  }), [language, t, preferences]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
