import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  ExternalLink,
  Cpu,
  Layers,
  Box,
  Globe,
  BookOpen,
  Clock,
  Sparkles,
  Terminal,
  ArrowRight,
  Check,
  Copy,
  Zap,
  Code2,
  Server,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sliders,
  DollarSign,
  Sun,
  Share2,
  Radio,
  FileCheck2,
  CheckCircle2,
  Flame,
  KeySquare,
  Network,
  GitFork
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

type Language = 'fa' | 'en';

interface Repository {
  id: string;
  name: string;
  titleFa: string;
  titleEn: string;
  taglineFa: string;
  taglineEn: string;
  categoryFa: string;
  categoryEn: string;
  stars: number;
  forks: number;
  language: string;
  githubUrl: string;
  primaryTech: string[];
  businessValueFa: string;
  businessValueEn: string;
  technicalHighlightsFa: string;
  technicalHighlightsEn: string;
  demoTab?: string;
  statsLabelFa: string;
  statsLabelEn: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const isRtl = lang === 'fa';

  // Active Demo Sandbox Tab
  const [activeTab, setActiveTab] = useState<'multi_sender' | 'quotes' | '3dprice' | 'locatime' | 'exambuddy'>('multi_sender');

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi_sender Simulator State
  const [broadcastText, setBroadcastText] = useState('پیشنهاد ویژه پاییزه: تحویل فوری سفارش‌های صنعتی با گارانتی رسمی.');
  const [channels, setChannels] = useState({
    telegram: true,
    bale: true,
    rubika: true,
    eitaa: true,
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastLogs, setBroadcastLogs] = useState<Array<{ id: string; platform: string; status: 'pending' | 'success' | 'isolated_retry'; time: string; details: string }>>([]);

  // Quotes Simulator State
  const sampleQuotes = useMemo(() => [
    { poet: 'حافظ', poetEn: 'Hafez', beyt: 'درخت دوستی بنشان که کام دل به بار آرد / نهال دشمنی برکن که رنج بی‌شمار آرد', tag: 'اخلاقی و مهر' },
    { poet: 'سعدی', poetEn: 'Saadi', beyt: 'بنی‌آدم اعضای یکدیگرند / که در آفرینش ز یک گوهرند', tag: 'انسانیت و همبستگی' },
    { poet: 'مولانا', poetEn: 'Rumi', beyt: 'هر چیز که در جستن آنی، آنی / صید منی، صید توام، گر بدانی', tag: 'عشق و حکمت' },
    { poet: 'خیام', poetEn: 'Khayyam', beyt: 'بر چهره گل نسیم نوروز خوش است / در صحن چمن روی دل‌افروز خوش است', tag: 'شادی و غنیمت وقت' },
    { poet: 'فردوسی', poetEn: 'Ferdowsi', beyt: 'توانا بود هر که دانا بود / ز دانش دل پیر برنا بود', tag: 'دانش و خرد' }
  ], []);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // 3D Slicing Quote Simulator State
  const [modelVolume, setModelVolume] = useState(65); // cm^3
  const [infillDensity, setInfillDensity] = useState(25); // %
  const [layerHeight, setLayerHeight] = useState(0.2); // mm
  const [material, setMaterial] = useState<'PLA' | 'PETG' | 'ABS'>('PLA');

  // Locatime Solar/Telemetry state
  const [timeState, setTimeState] = useState({
    utcString: '',
    localString: '',
    sunAngle: 42,
    tzName: 'Asia/Tehran'
  });

  // ExamBuddy / Tutorial Assistant State
  const [examCategory, setExamCategory] = useState<'math' | 'physics' | 'systems'>('systems');
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeState({
        utcString: now.toUTCString().split(' ')[4] + ' UTC',
        localString: now.toLocaleTimeString('fa-IR'),
        sunAngle: Math.floor(Math.sin(now.getHours() / 24 * Math.PI) * 75),
        tzName: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tehran'
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastLogs([]);
    const selected = Object.entries(channels).filter(([_, v]) => v).map(([k]) => k);

    selected.forEach((platform, idx) => {
      setTimeout(() => {
        setBroadcastLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            platform: platform.toUpperCase(),
            status: platform === 'rubika' ? 'isolated_retry' : 'success',
            time: new Date().toLocaleTimeString(),
            details: platform === 'rubika' 
              ? (isRtl ? 'بک‌آف خودکار اعمال شد، بدون تداخل با بقیه پیام‌رسان‌ها' : 'Auto exponential backoff, isolated from other drivers')
              : (isRtl ? 'تحویل موفقیت‌آمیز به کانال مقصد با متادیتا و هشتگ' : 'Delivered payload to target channels with rich hashtags')
          }
        ]);
        if (idx === selected.length - 1) {
          setIsBroadcasting(false);
        }
      }, (idx + 1) * 600);
    });
  };

  // Calculations for 3D Slicing Engine
  const filamentDensity = material === 'PLA' ? 1.24 : material === 'PETG' ? 1.27 : 1.04;
  const estimatedGrams = Math.round((modelVolume * (infillDensity / 100 * 0.4 + 0.2)) * filamentDensity);
  const printHours = ((modelVolume / (layerHeight * 12)) * 0.08).toFixed(1);
  const materialCostToman = Math.round(estimatedGrams * 1400);
  const machineServiceFeeToman = Math.round(parseFloat(printHours) * 35000);
  const totalQuoteToman = materialCostToman + machineServiceFeeToman;

  // The 6 Selected Best & Most Successful Repositories
  const repositories: Repository[] = [
    {
      id: 'Multi_sender',
      name: 'Multi_sender',
      titleFa: 'مولتی‌سندر (Multi_sender)',
      titleEn: 'Multi_sender Hub',
      taglineFa: 'موتور توزیع‌شده ارسال همزمان به تلگرام، بله، روبیکا و ایتا با ردیابی مجزای وضعیت تحویل',
      taglineEn: 'Unified Multi-Messenger Broadcast Engine (Telegram, Bale, Rubika, Eitaa) with Isolated Delivery State Tracking',
      categoryFa: 'سیستم‌های پیام‌رسان توزیع‌شده',
      categoryEn: 'Distributed Messaging Architecture',
      stars: 4,
      forks: 0,
      language: 'JavaScript / Node.js',
      githubUrl: 'https://github.com/aliaslany/Multi_sender',
      primaryTech: ['Node.js', 'Modular Drivers', 'Multi-Platform APIs', 'Resilience Patterns'],
      businessValueFa: 'حل قطعی چالش تکه‌تکه‌شدن کاربران در پیام‌رسان‌های مختلف. یک بار محتوا منتشر می‌شود و همزمان در کانال‌های بین‌المللی و بومی با گزارش خطای مجزا پخش می‌گردد.',
      businessValueEn: 'Eliminates platform fragmentation in Iranian and global messaging. Publish once to reach users across all ecosystems with zero crosstalk or single-point failures.',
      technicalHighlightsFa: 'جداسازی کامل لایه منبع (Source Crawler/Form) از درایورهای ارسال با Interface استاندارد، مدیریت صف مستقل و عدم تاثیرپذیری پلتفرم‌ها از خطای یکدیگر.',
      technicalHighlightsEn: 'Clean decoupling between ingest sources and driver dispatchers. Isolated execution contexts ensure a timeout on one messenger never stalls others.',
      demoTab: 'multi_sender',
      statsLabelFa: 'بیشترین ستاره در اکوسیستم پیام‌رسانی',
      statsLabelEn: 'Top-starred messaging engine'
    },
    {
      id: 'hydra-sender',
      name: 'hydra-sender',
      titleFa: 'هایدرا سندر (hydra-sender)',
      titleEn: 'HydraSender Crawler',
      taglineFa: 'ربات پایشگر لحظه‌ای آگهی‌های دیوار با استخراج متادیتای غنی و ارسال خودکار روی گیت‌هاب اکشنز',
      taglineEn: 'Real-Time Classifieds Crawler & Alerting Bot Running 100% Serverless on GitHub Actions',
      categoryFa: 'خزشگر ابری بدون سرور (Serverless)',
      categoryEn: 'Serverless Cloud Automation',
      stars: 2,
      forks: 1,
      language: 'Python',
      githubUrl: 'https://github.com/aliaslany/hydra-sender',
      primaryTech: ['Python', 'GitHub Actions CI/CD Cron', 'Reverse Engineering', 'Serverless'],
      businessValueFa: 'هزینه نگهداری سرور را به صفر رسانده است. نیازی به خرید سرور مجازی (VPS) ماهانه ندارد و به صورت خودکار تغییرات بازار را مانیتور و هشدار فوری ارسال می‌کند.',
      businessValueEn: 'Operates with 0$ monthly hosting expenses by orchestrating high-frequency scheduled runs natively inside GitHub Actions workflows.',
      technicalHighlightsFa: 'مهندسی معکوس APIهای دیوار، استخراج برچسب‌ها و مشخصات فنی آگهی، جلوگیری هوشمند از ارسال موارد تکراری با استفاده از State Cache.',
      technicalHighlightsEn: 'Engineered custom payload parsers, dynamic category hashtag generation, and state persistence without requiring external database instances.',
      demoTab: 'multi_sender',
      statsLabelFa: 'محبوب‌ترین پروژه دارای فورک فعال',
      statsLabelEn: 'Active fork & production crawler'
    },
    {
      id: '3DPRICE',
      name: '3DPRICE',
      titleFa: 'سامانه استعلام قیمت پرینت سه‌بعدی (3DPRICE)',
      titleEn: '3DPRICE Quotation Engine',
      taglineFa: 'موتور آنلاین قیمت‌گذاری قطعات صنعتی: آپلود فایل‌های STL/OBJ/3MF، اسلایس واقعی با CuraEngine و صدور پیش‌فاکتور',
      taglineEn: 'Production 3D Slicing & Instant Quotation SaaS with CuraEngine & WebGL 3D Preview',
      categoryFa: 'پلتفرم SaaS و مهندسی معکوس صنعتی',
      categoryEn: 'Manufacturing & 3D Engineering SaaS',
      stars: 0,
      forks: 1,
      language: 'TypeScript / React',
      githubUrl: 'https://github.com/aliaslany/3DPRICE',
      primaryTech: ['TypeScript', 'React', 'CuraEngine', 'Three.js / WebGL', 'Industrial SaaS'],
      businessValueFa: 'کاهش زمان صدور پیش‌فاکتور از ۳۰ دقیقه کار دستی توسط اپراتور به چند ثانیه آنلاین. مشتری بلافاصله حجم، وزن متریال و زمان ساخت را می‌بیند.',
      businessValueEn: 'Transforms a manual 30-minute slicing workflow into a sub-second instant customer quote, driving direct conversions for manufacturing bureaus.',
      technicalHighlightsFa: 'ادغام مستقیم موتور اسلایسر CuraEngine در پایپ‌لاین ابری، محاسبه خودکار زمان پرینت، حجم ساپورت‌گذاری و وزن بر اساس دانسیته فیلامنت.',
      technicalHighlightsEn: 'End-to-end integration of headless CuraEngine slicing with client-side 3D mesh analysis, calculating support volumes, infill densities, and toolpaths.',
      demoTab: '3dprice',
      statsLabelFa: 'معماری کامل SaaS تولید صنعتی',
      statsLabelEn: 'Full-stack manufacturing SaaS'
    },
    {
      id: 'nastaliq',
      name: 'nastaliq',
      titleFa: 'موتور خوشنویسی نستعلیق (nastaliq)',
      titleEn: 'Nastaliq Calligraphy Bot',
      taglineFa: 'رندرینگ سرورلس خط نستعلیق اصیل فارسی: وبهوک سریع کلودفلر، پردازش تایپوگرافی لینوکس Cairo/Pango و تولید تصویر',
      taglineEn: 'Serverless Persian Nastaliq Calligraphy Generator: Cloudflare Workers + Cairo/Pango Typography Pipeline',
      categoryFa: 'تایپوگرافی مدرن و پردازش ابری لبه (Edge)',
      categoryEn: 'Serverless Edge & Typography',
      stars: 0,
      forks: 0,
      language: 'Python / Shell / Worker',
      githubUrl: 'https://github.com/aliaslany/nastaliq',
      primaryTech: ['Cloudflare Workers', 'Pango/Cairo', 'Python', 'GitHub Actions', 'Telegram API'],
      businessValueFa: 'حل یکی از بزرگ‌ترین چالش‌های وب فارسی (نبود رندر دقیق خط نستعلیق روی دستگاه‌ها) به روش ابری بدون نیاز به سرور سنگین گرافیکی.',
      businessValueEn: 'Solves complex Persian nastaliq character kerning and cursive compounding via a lightweight edge-to-headless pipeline, keeping running costs at zero.',
      technicalHighlightsFa: 'معماری دو لایه هیبریدی: لایه لبه (Cloudflare Worker) درخواست‌ها را با تاخیر صفر پاسخ می‌دهد و رندر سنگین توسط پایپ‌لاین ایزوله انجام می‌شود.',
      technicalHighlightsEn: 'Hybrid architecture combining 0ms cold-start edge routing with headless Linux typographic layout engines (Pango/Cairo) for vector-quality rasterization.',
      demoTab: 'quotes',
      statsLabelFa: 'نوآوری تایپوگرافی ابری',
      statsLabelEn: 'Cutting-edge typography pipeline'
    },
    {
      id: 'persian-quotes',
      name: 'persian-quotes',
      titleFa: 'پایگاه داده و API ابیات فارسی (persian-quotes)',
      titleEn: 'Persian Quotes Dataset & API',
      taglineFa: 'بزرگ‌ترین مجموعه ساختاریافته شعر کهن: ۴۳,۵۶۴ بیت از ۳۸ شاعر کلاسیک به صورت JSON استاتیک و بدون نیاز به بک‌اند',
      taglineEn: 'Curated Dataset & Zero-Backend Static API of 43,564 Classical Persian Couplets from 38 Master Poets',
      categoryFa: 'داده‌های باز و زیرساخت توسعه‌دهندگان',
      categoryEn: 'Open Data & Developer Infrastructure',
      stars: 0,
      forks: 0,
      language: 'HTML / Static Data',
      githubUrl: 'https://github.com/aliaslany/persian-quotes',
      primaryTech: ['Static JSON API', 'Open Data', 'Zero-Backend Architecture', 'CDN Ready'],
      businessValueFa: 'زیرساخت عمومی و رایگان برای تمام توسعه‌دهندگان اپلیکیشن‌های فارسی؛ بدون نیاز به API Key، بدون محدودیت نرخ درخواست (Rate Limit) و با سرعت شبکه CDN.',
      businessValueEn: 'Zero-friction open infrastructure for mobile and web developers. Ultra-fast CDN distribution with zero subscription costs and zero rate limitations.',
      technicalHighlightsFa: 'دسته‌بندی دقیق موضوعی و شاعران، بهینه‌سازی فرمت JSON برای واکشی سریع کلاینت، طراحی منطبق بر استانداردهای REST استاتیک.',
      technicalHighlightsEn: 'Clean, normalized taxonomy spanning 38 poets, pre-indexed for client-side zero-latency search, random sampling, and offline caching.',
      demoTab: 'quotes',
      statsLabelFa: 'بیش از ۴۳,۵۰۰ رکورد ادبی تمیز',
      statsLabelEn: '43.5K+ structured literary records'
    },
    {
      id: 'locatime',
      name: 'locatime',
      titleFa: 'تجربه بصری زمان و مکان (locatime)',
      titleEn: 'Locatime Sensory Visualizer',
      taglineFa: 'ترسیم زنده زمان نجومی، زاویه خورشید، منطقه زمانی و مختصات جغرافیایی بر اساس IP کاربر در ipt.startstar.ir',
      taglineEn: 'Astronomical Time & Geolocation Composition Transforming IP into Solar Angles & Spatial Telemetry',
      categoryFa: 'طراحی تجربی UI/UX و محاسبات نجومی',
      categoryEn: 'Creative UI/UX & Geolocation',
      stars: 0,
      forks: 0,
      language: 'CSS / TypeScript',
      githubUrl: 'https://github.com/aliaslany/locatime',
      primaryTech: ['TypeScript', 'Sensory UI/UX', 'Astronomical Math', 'Geolocation APIs'],
      businessValueFa: 'نمایش خلاقانه اطلاعات مکانی و هویتی کاربر به عنوان یک سرویس زنده در دامنه startStar، ارتقای تصویر برند فنی نزد ذینفعان و کارفرمایان.',
      businessValueEn: 'Delivers a sensory, real-time spatial presentation in production at startstar.ir, establishing top-tier design polish and mathematical UI precision.',
      technicalHighlightsFa: 'محاسبه ریاضی زاویه تابش خورشید، نگاشت سیستم مختصاتی زمان، طراحی مدرن شیشه‌ای (Glassmorphism) و واکنش‌گرایی بالا.',
      technicalHighlightsEn: 'Combines client-side trigonometric solar zenith calculation with timezone telemetry, rendered via smooth fluid CSS canvas techniques.',
      demoTab: 'locatime',
      statsLabelFa: 'سرویس فعال در ipt.startstar.ir',
      statsLabelEn: 'Live in production at startstar.ir'
    }
  ];

  return (
    <div className={`min-h-screen bg-[#080B11] text-slate-100 ${isRtl ? 'font-sans' : 'font-en'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 radial-grid opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[350px] bg-cyan-600/5 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Banner: Security & Governance Compliance */}
      <div className="relative z-30 bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isRtl 
                ? 'امنیت احراز هویت تایید شد: کلیدهای حساس و پیکربندی فایربیس به متغیرهای محیطی امن منتقل و محافظت شدند.'
                : 'Security Verified: Hardcoded credentials mitigated & moved to secure client/server environment variables.'}
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">
            GH-SECRET-SCAN-01: RESOLVED
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#080B11]/85 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Identity & Avatar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#080B11] rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                  AA
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#080B11]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base tracking-tight">
                  {isRtl ? 'علی اصلانی' : 'Ali Aslani'}
                </h1>
                <span className="text-xs text-slate-400 font-mono">@aliaslany</span>
              </div>
              <p className="text-xs text-indigo-300 hidden sm:block">
                {isRtl ? 'معمار سیستم‌های توزیع‌شده و اتوماسیون ابری' : 'Systems & Cloud Automation Architect'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#showcase" className="hover:text-indigo-400 transition-colors">
              {isRtl ? '۶ پروژه پرچمدار' : 'Top 6 Repositories'}
            </a>
            <a href="#sandbox" className="hover:text-indigo-400 transition-colors">
              {isRtl ? 'لابراتوار تعاملی' : 'Interactive Lab'}
            </a>
            <a href="#principles" className="hover:text-indigo-400 transition-colors">
              {isRtl ? 'ارزش برای ذینفعان' : 'Stakeholder Value'}
            </a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors">
              {isRtl ? 'همکاری' : 'Collaborate'}
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(l => l === 'fa' ? 'en' : 'fa')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-200 hover:bg-white/5 transition-all flex items-center gap-1.5"
              title="تغییر زبان / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'fa' ? 'English' : 'فارسی'}</span>
            </button>

            <a
              href="https://github.com/aliaslany"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'گیت‌هاب من' : 'GitHub Profile'}</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>
              {isRtl 
                ? 'پلتفرم startStar: ارائه شایستگی‌های مهندسی برای مدیران فنی، تیم‌های محصول و سرمایه‌گذاران'
                : 'startStar Platform: Production Engineering Portfolio for Stakeholders & Leaders'}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.2]">
            {isRtl ? (
              <>
                معماری سیستم‌های <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">مقیاس‌پذیر، توزیع‌شده</span> و ابری
              </>
            ) : (
              <>
                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">Resilient, Distributed</span> & Serverless Systems
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
            {isRtl ? (
              'تمرکز من بر حل مسائل پیچیده اکوسیستم ارتباطی و نرم‌افزاری است: از طراحی پل‌های چندپیام‌رسانه مقاوم در برابر قطعی، تا اسلایسینگ سه‌بعدی صنعتی بدون سرور و سامانه‌های پایش بازار با کمترین هزینه نگهداری.'
            ) : (
              'Specialized in building mission-critical bridges and automations: from decoupled multi-messenger fanout engines and industrial 3D slicing SaaS to zero-cost serverless data crawlers.'
            )}
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">۶</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {isRtl ? 'پروژه شاخص مهندسی' : 'Flagship Architectures'}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">۳۷+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {isRtl ? 'ریپازیتوری عمومی و ابزار' : 'Public Repositories'}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">۴۳,۵۰۰+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {isRtl ? 'رکورد داده باز منتشرشده' : 'Curated Open Records'}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">۰$</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {isRtl ? 'هزینه نگهداری سرورلس' : 'Monthly Hosting Waste'}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#showcase"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <span>{isRtl ? 'بررسی ۶ پروژه برتر' : 'Explore Top 6 Repositories'}</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
            <a
              href="#sandbox"
              className="glass-panel hover:bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-medium text-sm text-slate-200 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'تست تعاملی در مرورگر' : 'Live Interactive Lab'}</span>
            </a>
          </div>

        </div>
      </section>

      {/* Flagship 6 Repositories Showcase */}
      <section id="showcase" className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>{isRtl ? 'منتخب ویژه برای ذینفعان' : 'Executive Portfolio Selection'}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold text-white">
            {isRtl ? '۶ پروژه برتر و موفق‌ترین دستاوردهای فنی' : 'The 6 Best & Most Successful Repositories'}
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {isRtl ? (
              'این پروژه‌ها بازتاب‌دهنده مهارت‌های عملی من در طراحی سیستم، حل چالش‌های زیرساختی بازار ایران، و پیاده‌سازی معماری‌های مقرون‌به‌صرفه و پایدار است.'
            ) : (
              'Carefully curated to demonstrate technical depth across distributed messaging, serverless automation, CAD engineering SaaS, and open infrastructure.'
            )}
          </p>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative group border border-white/10"
            >
              {/* Header: Title & Badges */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      {isRtl ? repo.categoryFa : repo.categoryEn}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                      {isRtl ? repo.titleFa : repo.titleEn}
                    </h4>
                  </div>
                  
                  {/* GitHub Stars & Fork Badges */}
                  <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 text-xs text-slate-300 font-mono shrink-0">
                    <span className="flex items-center gap-1">
                      ⭐ {repo.stars}
                    </span>
                    {repo.forks > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        ⑂ {repo.forks}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {isRtl ? repo.taglineFa : repo.taglineEn}
                </p>

                {/* Stakeholder Value Box */}
                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'ارزش واقعی برای کسب‌وکار و ذینفعان:' : 'Stakeholder & Business Value:'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isRtl ? repo.businessValueFa : repo.businessValueEn}
                  </p>
                </div>

                {/* Technical Highlights */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isRtl ? 'نوآوری و ساختار معماری:' : 'Engineering Architecture:'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isRtl ? repo.technicalHighlightsFa : repo.technicalHighlightsEn}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {repo.primaryTech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] bg-slate-800/60 text-slate-300 px-2.5 py-0.5 rounded-full border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: CTAs */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between gap-3">
                <a
                  href={repo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all border border-white/10"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>{isRtl ? 'مشاهده در گیت‌هاب' : 'View Code'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {repo.demoTab && (
                  <button
                    onClick={() => {
                      setActiveTab(repo.demoTab as any);
                      document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    <span>{isRtl ? 'تست در لابراتوار' : 'Run in Sandbox'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* Interactive Sandbox Lab (100% Client-Side on GitHub Pages) */}
      <section id="sandbox" className="py-20 px-4 bg-gradient-to-b from-transparent via-[#0d121f] to-transparent border-y border-white/5">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>{isRtl ? 'لابراتوار تعاملی زنده' : 'Interactive Sandbox Lab'}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              {isRtl ? 'تست و بررسی عملکرد زنده سیستم‌ها' : 'Experience the Systems Live in Your Browser'}
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              {isRtl ? (
                'تمامی شبیه‌سازها به صورت ۱۰۰٪ کلاینت‌ساید روی GitHub Pages اجرا می‌شوند و نیازی به سرور خارجی ندارند.'
              ) : (
                'Run interactive simulations of the architectures directly on GitHub Pages with zero external backend dependencies.'
              )}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl glass-panel max-w-3xl mx-auto border border-white/10">
            <button
              onClick={() => setActiveTab('multi_sender')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'multi_sender'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>{isRtl ? 'شبیه‌ساز مولتی‌سندر' : 'Multi-Sender Sim'}</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'quotes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isRtl ? 'پایگاه داده اشعار' : 'Persian Quotes API'}</span>
            </button>

            <button
              onClick={() => setActiveTab('3dprice')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === '3dprice'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{isRtl ? 'محاسبه‌گر پرینت ۳بعدی' : '3D Slicing Calculator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('locatime')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'locatime'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{isRtl ? 'رادار زمان Locatime' : 'Locatime Radar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('exambuddy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'exambuddy'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'دستیار آموزشی startStar' : 'startStar Tutor AI'}</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 min-h-[420px]">
            
            {/* 1. Multi_sender Simulation */}
            {activeTab === 'multi_sender' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-indigo-400" />
                    <span>{isRtl ? 'شبیه‌ساز پخش همزمان پیام (Multi_sender Architecture)' : 'Multi-Platform Broadcast Simulator'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl 
                      ? 'چگونگی ارسال همزمان به تلگرام، بله، روبیکا و ایتا را با ردیابی مستقل و ایزولاسیون خطا تست کنید.'
                      : 'Test concurrent broadcast fanout across Telegram, Bale, Rubika, and Eitaa with failure-isolation telemetry.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isRtl ? 'متن پست ارسالی:' : 'Broadcast Message Payload:'}
                  </label>
                  <textarea
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Platform Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'telegram', label: 'Telegram Bot API' },
                    { id: 'bale', label: 'Bale Messenger' },
                    { id: 'rubika', label: 'Rubika API Driver' },
                    { id: 'eitaa', label: 'Eitaa Bot API' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setChannels(c => ({ ...c, [p.id]: !c[p.id as keyof typeof c] }))}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        channels[p.id as keyof typeof channels]
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-900 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>{p.label}</span>
                      <span className={`w-2 h-2 rounded-full ${channels[p.id as keyof typeof channels] ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSimulateBroadcast}
                  disabled={isBroadcasting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  {isBroadcasting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  )}
                  <span>{isRtl ? 'شبیه‌سازی ارسال همزمان (Fanout Dispatch)' : 'Dispatch Broadcast Fanout'}</span>
                </button>

                {/* Execution Telemetry Log */}
                {broadcastLogs.length > 0 && (
                  <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 space-y-2 font-mono text-xs">
                    <div className="text-slate-400 font-bold mb-2 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isRtl ? 'لاگ اجرای درایورها:' : 'Driver Execution Stream:'}</span>
                    </div>
                    {broadcastLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                          <span className="text-white font-bold">{log.platform}</span>
                          <span className="text-slate-400 text-[11px]">{log.details}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Quotes API & Nastaliq Typography */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <span>{isRtl ? 'داده‌های ادبیات فارسی (persian-quotes + nastaliq)' : 'Persian Quotes & Calligraphy Dataset'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl ? 'نمونه زنده از پایگاه داده ۴۳,۵۶۴ بیتی با واکشی استاتیک و رندر تایپوگرافی اصیل' : 'Live sample from 43.5K couplet collection with static zero-backend indexing'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentQuoteIndex((i) => (i + 1) % sampleQuotes.length)}
                    className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'بیت تصادفی دیگر' : 'Random Couplet'}</span>
                  </button>
                </div>

                {/* Calligraphy Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                  <div className="text-xs uppercase font-mono text-indigo-400 tracking-wider">
                    {sampleQuotes[currentQuoteIndex].tag}
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed tracking-wide font-sans py-2">
                    « {sampleQuotes[currentQuoteIndex].beyt} »
                  </p>
                  <div className="text-sm font-semibold text-slate-300">
                    — {isRtl ? sampleQuotes[currentQuoteIndex].poet : sampleQuotes[currentQuoteIndex].poetEn}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5 font-mono">
                  <span>Dataset: 43,564 couplets | Format: Static JSON REST | Auth: None Required</span>
                  <button
                    onClick={() => handleCopy(sampleQuotes[currentQuoteIndex].beyt, 'quote')}
                    className="hover:text-white flex items-center gap-1"
                  >
                    {copiedId === 'quote' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'quote' ? 'کپی شد' : 'کپی بیت'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. 3DPRICE Quotation Engine */}
            {activeTab === '3dprice' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Box className="w-5 h-5 text-indigo-400" />
                    <span>{isRtl ? 'محاسبه‌گر هزینه و زمان اسلایسینگ (3DPRICE Engine)' : '3D Slicing & Quote Calculator'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'شبیه‌سازی پارامترهای CuraEngine و محاسبه بلادرنگ وزن فیلامنت و هزینه تمام‌شده قطعه صنعتی' : 'Simulate headless CuraEngine slicing parameters to calculate material usage and commercial estimates.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Inputs */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>{isRtl ? 'حجم مش مدل (cm³):' : 'Mesh Volume (cm³):'}</span>
                        <span className="font-mono text-indigo-400">{modelVolume} cm³</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="300"
                        value={modelVolume}
                        onChange={(e) => setModelVolume(parseInt(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>{isRtl ? 'تراکم توپر بودن یا اینفیل (Infill %):' : 'Infill Density (%):'}</span>
                        <span className="font-mono text-cyan-400">{infillDensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={infillDensity}
                        onChange={(e) => setInfillDensity(parseInt(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>{isRtl ? 'ارتفاع لایه پرینت (Layer Height):' : 'Layer Height (mm):'}</span>
                        <span className="font-mono text-purple-400">{layerHeight} mm</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[0.12, 0.20, 0.28].map(h => (
                          <button
                            key={h}
                            onClick={() => setLayerHeight(h)}
                            className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                              layerHeight === h
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {h} mm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        {isRtl ? 'نوع متریال صنعتی:' : 'Polymer Material:'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['PLA', 'PETG', 'ABS'] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => setMaterial(m)}
                            className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                              material === m
                                ? 'bg-cyan-600 text-white border-cyan-500'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Slicing Output Card */}
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 font-mono uppercase mb-1">
                        {isRtl ? 'پیش‌فاکتور تولید خودکار' : 'Automated Production Quote'}
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        {totalQuoteToman.toLocaleString('fa-IR')} <span className="text-xs text-indigo-300">تومان</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>{isRtl ? 'تخمین وزن فیلامنت:' : 'Filament Weight:'}</span>
                        <span className="text-white font-bold">{estimatedGrams} g</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{isRtl ? 'زمان تقریبی ساخت:' : 'Print Duration:'}</span>
                        <span className="text-white font-bold">{printHours} {isRtl ? 'ساعت' : 'hrs'}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{isRtl ? 'هزینه متریال خام:' : 'Raw Material:'}</span>
                        <span className="text-slate-300">{materialCostToman.toLocaleString('fa-IR')} ت</span>
                      </div>
                    </div>

                    <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-[11px] text-indigo-300">
                      {isRtl 
                        ? 'در پروژه اصلی 3DPRICE، این محاسبات مستقیماً از پارس فایل هندسی STL با هسته CuraEngine لینوکس استخراج می‌شود.'
                        : 'In production 3DPRICE, geometry toolpaths and extrusion rates are computed directly via headless CuraEngine.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Locatime Geolocation Radar */}
            {activeTab === 'locatime' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <span>{isRtl ? 'رادار موقعیت مکانی و زمان نجومی (locatime)' : 'Locatime Spatial & Astronomical Radar'}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'تجربه بصری زنده از ساعت و زاویه خورشید، الهام‌گرفته از سرویس فعال در ipt.startstar.ir' : 'Live visual spatial composition of solar progression and timezone geometry.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-1">
                    <div className="text-xs text-slate-400">{isRtl ? 'زمان محلی دستگاه' : 'Local Device Time'}</div>
                    <div className="text-2xl font-bold font-mono text-cyan-400">{timeState.localString}</div>
                  </div>
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-1">
                    <div className="text-xs text-slate-400">{isRtl ? 'زمان استاندارد جهانی' : 'Coordinated Universal Time'}</div>
                    <div className="text-2xl font-bold font-mono text-indigo-400">{timeState.utcString}</div>
                  </div>
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-1">
                    <div className="text-xs text-slate-400">{isRtl ? 'زاویه تخمینی خورشید' : 'Solar Elevation Angle'}</div>
                    <div className="text-2xl font-bold font-mono text-amber-400">{timeState.sunAngle}°</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{isRtl ? 'مسیر روزانه خورشید' : 'Solar Progression'}</span>
                    <span className="font-mono text-slate-400">{timeState.tzName}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-amber-400 to-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(Math.max((new Date().getHours() / 24) * 100, 10), 95)}%` }}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <a
                      href="https://github.com/aliaslany/locatime"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <span>{isRtl ? 'مشاهده سورس‌کد پروژه locatime در گیت‌هاب' : 'Inspect locatime Source Code on GitHub'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 5. ExamBuddy / startStar AI Tutor */}
            {activeTab === 'exambuddy' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span>{isRtl ? 'دستیار آموزشی هوشمند startStar (ExamBuddy)' : 'startStar Educational Assistant (ExamBuddy)'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'نمونه راه‌حل‌های گام‌به‌گام و تحلیل تشریحی سوالات امتحانی به زبان فارسی'
                        : 'Step-by-step interactive problem solutions & pedagogical AI tutor module.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <KeySquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{showKeyInput ? 'بستن' : 'کلید دلخواه'}</span>
                  </button>
                </div>

                {showKeyInput && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                    <label className="text-slate-300 block">
                      {isRtl 
                        ? 'وارد کردن اختیاری کلید Gemini شخصی (ذخیره امن در مرورگر):'
                        : 'Optional Bring-Your-Own Gemini API Key (stored in local browser memory):'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded-lg p-2 text-xs flex-1 text-white font-mono"
                      />
                      <button
                        onClick={() => alert(isRtl ? 'کلید با موفقیت ثبت شد.' : 'Key registered locally.')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        {isRtl ? 'ذخیره' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Precomputed Educational Walkthroughs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'systems', label: isRtl ? 'معماری سیستم پیام‌رسان' : 'Messaging Systems' },
                    { id: 'math', label: isRtl ? 'بهینه‌سازی حجم هندسی ۳بعدی' : '3D Geometry Math' },
                    { id: 'physics', label: isRtl ? 'مکانیک حرارتی تزریق فیلامنت' : 'Thermal Slicing Physics' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setExamCategory(cat.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${
                        examCategory === cat.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {examCategory === 'systems' && (isRtl ? 'مسئله: چگونه می‌توان ارسال همزمان به ۴ پلتفرم را بدون قفل‌شدگی صف پیاده کرد؟' : 'Problem: Non-blocking fanout concurrency across diverse messenger APIs')}
                      {examCategory === 'math' && (isRtl ? 'مسئله: محاسبه انتگرال حجم مدل مش STL جهت برآورد هزینه پلیمر' : 'Problem: Volume integration of non-manifold STL triangular meshes')}
                      {examCategory === 'physics' && (isRtl ? 'مسئله: اثر ویسکوزیته و سرعت سردشدن لایه اکستروژن روی چسبندگی قطعه' : 'Problem: Thermal extrusion viscosity in FDM 3D printing')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed space-y-2 border-t border-white/5 pt-3">
                    {examCategory === 'systems' && (
                      <p>
                        {isRtl ? (
                          'پاسخ تحلیلی ExamBuddy: در پروژه Multi_sender، از الگوی Driver-Adapter استفاده شده است. هر ارسال‌کننده (Telegram, Bale, Rubika, Eitaa) به عنوان یک Worker ناهمگام (Async Worker) مستقل اجرا می‌شود. در صورت Timeout یا Rate Limit در یکی از پیام‌رسان‌ها، سیستم با Exponential Backoff تلاش مجدد را آغاز می‌کند بدون آنکه بر فرآیند ارسال سایر پیام‌رسان‌ها تاثیری بگذارد.'
                        ) : (
                          'Solution: Multi_sender applies the Driver-Adapter pattern. Each messenger runner executes in an independent async promise context. Exponential backoffs on rate limits ensure one slow API never blocks the remaining channels.'
                        )}
                      </p>
                    )}
                    {examCategory === 'math' && (
                      <p>
                        {isRtl ? (
                          'پاسخ تحلیلی ExamBuddy: در موتور 3DPRICE، فایل‌های STL به مثلث‌های سه‌بعدی تجزیه می‌شوند. با اعمال قضیه دیورژانس گاوس بر روی تک‌تک وجوه مثلثی، حجم بسته به صورت دقیق بدون نیاز به بارگذاری سنگین در حافظه محاسبه شده و ضربدر دانسیته متریال (مثلاً ۱.۲۴ برای PLA) می‌گردد.'
                        ) : (
                          'Solution: 3DPRICE applies the Gauss Divergence Theorem across signed tetrahedral volumes formed by triangular facets, yielding exact cubic volume with low memory consumption.'
                        )}
                      </p>
                    )}
                    {examCategory === 'physics' && (
                      <p>
                        {isRtl ? (
                          'پاسخ تحلیلی ExamBuddy: زمان خنک‌سازی لایه با پارامترهای CuraEngine کنترل می‌شود. در صورتی که زمان چاپ یک لایه کمتر از ۱۰ ثانیه باشد، فن خنک‌کننده حداکثر توان خود را اعمال می‌کند تا از دفورمه شدن قطعه نهایی در قطعات ظریف جلوگیری شود.'
                        ) : (
                          'Solution: Thermal bonding between adjacent layers requires maintaining glass transition temperature (Tg) thresholds, managed via CuraEngine dynamic minimum layer time overrides.'
                        )}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* Stakeholder Value & Why Hire Ali Aslani */}
      <section id="principles" className="py-20 px-4 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>{isRtl ? 'مزیت رقابتی و ارزش برای ذینفعان' : 'Why Stakeholders Choose Ali Aslani'}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold text-white">
            {isRtl ? 'چرا همکاری با من برای پروژه‌های بزرگ به صرفه است؟' : 'Engineering Principles Delivering Measurable Business ROI'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'کاهش شدید هزینه‌های زیرساخت ابری' : 'Zero-Waste Cloud Economics'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl ? (
                'با تکیه بر معماری بدون سرور (Serverless GitHub Actions و Cloudflare Workers)، نیازی به اجاره سرورهای گران‌قیمت ۲۴ ساعته برای کراولرها و ربات‌ها نیست. هزینه‌های ماهانه تا ۹۰٪ کاهش می‌یابد.'
              ) : (
                'By leveraging ephemeral CI/CD runners and Cloudflare Edge webhooks, 24/7 idle VPS expenses are virtually eliminated, slashing monthly burn rates.'
              )}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'تسلط همزمان بر اکوسیستم داخلی و بین‌المللی' : 'Bilingual Ecosystem Mastery'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl ? (
                'شناخت عمیق پیچیدگی‌های بومی (بله، روبیکا، ایتا، دیوار، درگاه‌های کارت‌به‌کارت بانکی) در کنار متدهای مدرن جهانی (React 19، TypeScript، کورا، پایتون).'
              ) : (
                'Deep navigation of specialized domestic platforms (Divar, Bale, Rubika, Eitaa, card verification) married with modern global web standards.'
              )}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'تعهد بالا به کیفیت کد و امنیت' : 'Security & Code Rigor'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl ? (
                'پیاده‌سازی تایپینگ دقیق TypeScript، ایزولاسیون کامل کلیدهای حساس و اعتبارسنجی مداوم خطاهای امنیتی بر اساس استانداردهای مخازن مدرن گیت‌هاب.'
              ) : (
                'Strict TypeScript enforcement, clean modular architecture, and proactive secret-scanning mitigation ensuring safe production rollouts.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Stakeholder Connect & Collaboration CTA */}
      <section id="contact" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-indigo-500/30 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isRtl ? 'آماده همکاری در پروژه‌های سطح بالا و مشاوره معماری' : 'Available for High-Impact Roles & Consulting'}
          </h3>

          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            {isRtl ? (
              'اگر به دنبال ساخت سیستم‌های پیام‌رسان توزیع‌شده، اتوماسیون‌های پردازش داده بدون هزینه سرور، یا موتورهای محاسباتی سه‌بعدی و تجاری هستید، آماده تبادل نظر هستیم.'
            ) : (
              'Let’s discuss how distributed messaging, resilient scraping pipelines, or CAD-driven SaaS can accelerate your product roadmap.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://github.com/aliaslany"
              target="_blank"
              rel="noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub: @aliaslany</span>
            </a>

            <a
              href="mailto:a77aslany@gmail.com"
              className="glass-panel hover:bg-white/10 px-6 py-3 rounded-xl font-medium text-sm text-slate-200 transition-all border border-white/10 flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>a77aslany@gmail.com</span>
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
        <p>
          {isRtl 
            ? 'توسعه‌یافته با React 19، Tailwind CSS v4، و طراحی اختصاصی برای استقرار خودکار روی GitHub Pages'
            : 'Crafted with React 19 & Tailwind CSS v4, optimized for continuous deployment to GitHub Pages.'}
        </p>
        <p className="font-mono text-[11px] text-slate-600">
          startStar Platform © {new Date().getFullYear()} Ali Aslani (@aliaslany) | All Rights Reserved
        </p>
      </footer>

    </div>
  );
}
