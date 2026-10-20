# 🌟 startStar | پلتفرم شخصی و ویترین مهندسی علی اصلانی

> **Personal Branding Hub & Flagship Engineering Showcase for Stakeholders, Clients & Technical Leaders**  
> **مخزن و وب‌سایت معرفی تخصص، معماری سیستم‌های توزیع‌شده و ۶ پروژه شاخص مهندسی**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Deploy-success?style=flat-square&logo=github)](https://aliaslany.github.io/startStar/)
[![Security Audit](https://img.shields.io/badge/Security-Secret%20Scan%20Mitigated-emerald?style=flat-square&logo=shield)](https://github.com/aliaslany/startStar/security/secret-scanning)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Tailwind%20v4%20%7C%20TypeScript%20%7C%20Vite-indigo?style=flat-square)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🎯 درباره پروژه (About startStar)

این مخزن و وب‌اپلیکیشن مربوط به دامنه و وب‌سایت **startStar**، پایگاه ارائه توانمندی‌های مهندسی **علی اصلانی ([@aliaslany](https://github.com/aliaslany))** برای ذینفعان، سرمایه‌گذاران، مدیران ارشد فناوری (CTO) و مشتریان صنعتی است.

این پلتفرم علاوه بر معرفی معماری‌ها، شامل **لابراتوار تعاملی زنده (Interactive Sandbox)** در مرورگر بدون نیاز به هیچ‌گونه سرور خارجی بوده و به صورت ۱۰۰٪ استاتیک روی **GitHub Pages** میزبانی می‌شود.

---

## 🚀 ۶ پروژه شاخص منتخب (The 6 Featured Flagship Repositories)

| # | پروژه (Repository) | حوزه تخصصی (Domain) | شاخص و دستاورد (Key Metrics & Innovation) | ارزش برای ذینفعان (Stakeholder Value) |
|---|---|---|---|---|
| **۱** | [**Multi_sender**](https://github.com/aliaslany/Multi_sender) | سیستم‌های توزیع‌شده پیام‌رسان | ⭐ ۴ ستاره • Node.js • درایورهای ماژولار | ارسال همزمان و ایزوله به تلگرام، بله، روبیکا و ایتا با ردیابی مستقل تحویل |
| **۲** | [**hydra-sender**](https://github.com/aliaslany/hydra-sender) | خزشگر ابری بدون سرور | ⭐ ۲ ستاره • ۱ فورک • پایتون • Serverless | مانیتورینگ لحظه‌ای آگهی‌های دیوار با اجرای کرون روی گیت‌هاب اکشنز (هزینه سرور: ۰$) |
| **۳** | [**3DPRICE**](https://github.com/aliaslany/3DPRICE) | مهندسی سه‌بعدی و SaaS صنعتی | ۱ فورک • TypeScript • React • CuraEngine | اسلایسینگ ابری فایل‌های STL/OBJ/3MF و محاسبه بلادرنگ قیمت و وزن فیلامنت |
| **۴** | [**nastaliq**](https://github.com/aliaslany/nastaliq) | تایپوگرافی ابری و وب‌هوک لبه | Cloudflare Workers + Cairo/Pango + Python | رندر باکیفیت وکتور خط نستعلیق اصیل فارسی بدون نیاز به سرور گرافیکی اختصاصی |
| **۵** | [**persian-quotes**](https://github.com/aliaslany/persian-quotes) | داده‌های باز و API استاتیک | ۴۳,۵۶۴ بیت شعر • ۳۸ شاعر نامدار • بدون بک‌اند | زیرساخت عمومی ادبی بدون محدودیت نرخ (Rate-limit) و با سرعت CDN برای توسعه‌دهندگان |
| **۶** | [**locatime**](https://github.com/aliaslany/locatime) | طراحی تجربی UI و محاسبات نجومی | CSS / TypeScript • فعال در `ipt.startstar.ir` | نگاشت زاویه خورشید، موقعیت مکانی و مختصات زمانی بر اساس IP کاربر |

---

## 🛡️ برطرف‌سازی نشت امنیتی (Security Mitigation Notice)
- **شناسه رخداد:** `https://github.com/aliaslany/startStar/security/secret-scanning/1`
- **اقدامات انجام‌شده:**
  1. تمامی کلیدهای سخت‌کد شده در `firebase-applet-config.json` و ماژول فایربیس با ساختار امن متغیرهای محیطی (`import.meta.env`) جایگزین شدند.
  2. فایل‌های امنیتی نمونه (`.env.example` و `firebase-applet-config.example.json`) ایجاد شدند.
  3. قوانین سخت‌گیرانه برای جلوگیری از کامیت کلیدهای Firebase و فایلهای `.env*` در `.gitignore` اضافه گردید.
  4. لایه فایربیس به صورت Graceful Fallback بازنویسی شد تا در نبود کلید خصوصی هیچ‌گونه خطایی رخ ندهد.

---

## 💻 راه‌اندازی محلی (Local Development)

```bash
# ۱. کلون مخزن
git clone https://github.com/aliaslany/startStar.git
cd startStar

# ۲. نصب وابستگی‌ها
npm install

# ۳. اجرای محیط توسعه
npm run dev

# ۴. ساخت نسخه نهایی استاتیک
npm run build
```

---

## 🌐 استقرار روی گیت‌هاب پیجز (GitHub Pages Deployment)
این مخزن با استفاده از GitHub Actions در مسیر `.github/workflows/deploy.yml` با هر بار کامیت روی شاخه `main` به صورت کاملاً خودکار ساخته شده و در دامنه زیر منتشر می‌شود:
👉 **[https://aliaslany.github.io/startStar/](https://aliaslany.github.io/startStar/)**
