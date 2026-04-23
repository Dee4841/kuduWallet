import { useEffect, useState } from 'react';
import '../stylesheets/kuduwallet.css';
import '../stylesheets/homepage.css';
import { Banknote, FileScan, Printer, Wallet } from 'lucide-react';

const Google_Client_ID = import.meta.env.VITE_Google_Client_ID as string;
const Redirect_URL = import.meta.env.VITE_REDIRECT_URL  as string;

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLoginWithGoogle = () => {
    const params = new URLSearchParams({
      client_id: Google_Client_ID,
      redirect_uri: Redirect_URL,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <section className="home-root">

            <header className="home-header">
        <section className="home-logo">
          <KuduIcon />
          <section className="home-logo-text">KuduWallet</section>
        </section>

       {/* <section className="home-nav">
          <button className="home-nav-link">About</button>
        </section>
       */}
      </header>
      {/* Background decorative circles */}
      <section className="home-bg-circle home-bg-circle--1" />
      <section className="home-bg-circle home-bg-circle--2" />
    
      {/* Floating feature cards */}
      <section className="home-float home-float--left">
        <FeatureCard icon={<Printer size={24} />} title="Print" text="Send documents to campus printers instantly." />
        <FeatureCard icon={<FileScan size={24}/>} title="Scan" text="Scan notes directly to your cloud storage." />
      </section>

      <section className="home-float home-float--right">
        <FeatureCard icon={<Banknote size = {24} />} title="Balance" text="Check your kude balance directly." />
        <FeatureCard icon={<Wallet size={24} />} title="TopUp" text="Top up your balance using online payment." />
      </section>

      {/* Main content */}
      <main className={`home-main ${visible ? 'home-main--visible' : ''}`}>
        <section className="home-card">
          {/* Brand badge */}
          <section className="home-eyebrow">
            <section className="home-eyebrow-dot" />
            Campus Credit System
          </section>

          {/* Headline */}
          <h1 className="home-headline">
            Your Kudu Bucks,<br />
            <em>always at hand.</em>
          </h1>

          <p className="home-subtext">
            Top up, spend, and track your campus credits across Wits
            services.
          </p>

          {/* sectionider */}
          <section className="home-sectionider" />

          {/* Google button — calls handleLoginWithGoogle directly */}
          <button
            className="home-google-btn"
            onClick={handleLoginWithGoogle}
            type="button"
          >
            <GoogleIcon />
            <section>Continue with Google</section>
          </button>

          {/* Domain restriction note */}
          <p className="home-domain-note">
            <LockIcon />
            Safe and Secure
          </p>
        </section>

      </main>
    </section>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */


function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}
    >
      <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <section className="home-feature-card">
      <section className="home-feature-icon">{icon}</section>
      <section>
        <p className="home-feature-title">{title}</p>
        <p className="home-feature-text">{text}</p>
      </section>
    </section>
  );
}

function KuduIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#FFB81C" />
      <path d="M8 20V8l5.5 6L8 20z" fill="#003B5C" />
      <path d="M13.5 14l6.5 6H13.5v-6z" fill="#003B5C" opacity="0.6" />
      <path d="M13.5 14V8l6.5 6h-6.5z" fill="#003B5C" />
    </svg>
  );
}
