import { useEffect, useState } from 'react';
import axios from 'axios';
import {  CircleArrowDown, History, ShieldCheck, TrendingDown } from 'lucide-react';
import '../stylesheets/kuduwallet.css';
import '../stylesheets/dashboard.css';

const API_BASE_URL= import.meta.env.VITE_API_URL;

interface Transaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  icon: string;
}

const TRANSACTIONS: Transaction[] = [
  
];

export default function LandPage() {
  const [visible, setVisible] = useState(false);

  const userEmail = localStorage.getItem('userEmail') ?? 'student@wits.ac.za';
  const userName = localStorage.getItem('userName') ?? 'student';
  const balance = 0.0;
  const transactions = TRANSACTIONS;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('accessToken');
      localStorage.removeItem("userName");
      localStorage.removeItem('userEmail');
      window.location.href = '/';
    } catch {
      console.error('Failed to logOut');
    }
  };

  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
  const totalTopUp = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
  const txCount = transactions.length;

  return (
    <section className="dash-root">

      {/* TOPBAR */}
      <header className="dash-topbar">
        <section className="dash-container dash-topbar-inner">
          <section className="dash-topbar-logo">
            <KuduIcon />
            <section>KuduWallet</section>
          </section>

          <section className="dash-topbar-right">
            <section className="dash-topbar-email">{userEmail}</section>
            <button className="dash-signout-btn" onClick={handleLogOut}>
              Sign out
            </button>
          </section>
        </section>
      </header>

      {/* HERO */}
      <section className="dash-hero">
        <section className="dash-container">
          <section className="dash-hero-inner">

            <section className="dash-hero-left">
              <section className="dash-hero-eyebrow">
                <section className="dash-hero-dot" />
                Campus Credit System
              </section>

              <h1 className="dash-hero-greeting">
                Welcome back,<br />
                <em>{userName}</em>
              </h1>

              <p className="dash-hero-meta">
                {new Date().toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </section>

            <section className="dash-hero-right">
              <p className="dash-hero-bal-label">Available Balance</p>
              <p className="dash-hero-bal-amount">
                <section>R</section>{balance.toFixed(2)}
              </p>

              <section className="dash-hero-actions">
                <button className="dash-action-btn dash-action-btn--primary">＋ Top up</button>
                <button className="dash-action-btn dash-action-btn--ghost">⇄ Transfer</button>
                <button className="dash-action-btn dash-action-btn--ghost">↗ Pay</button>
              </section>
            </section>

          </section>
        </section>
      </section>

      {/* BODY */}
      <section className={`dash-body ${visible ? 'dash-body--visible' : ''}`}>
        <section className="dash-container">

          <section className="dash-stats">
            <StatCard icon={< TrendingDown size={20} strokeWidth={2.5}/>} label="Spent this month" value={`R ${totalSpent.toFixed(2)}`} delta="Across all services" trend="debit" />
            <StatCard icon={<CircleArrowDown size={20} strokeWidth={2.5}/>} label="Total topped up" value={`R ${totalTopUp.toFixed(2)}`} delta="This period" trend="credit" />
            <StatCard icon={< History size={20} strokeWidth={2.5}/>} label="Transactions" value={String(txCount)} delta="Recent activity" trend="neutral" />
            <StatCard icon={<ShieldCheck size={20} strokeWidth={2.5}/>} label="Account status" value="Active" delta="Domain verified" trend="neutral" />
          </section>

          <section className="dash-section full-width"> 
              <section className="dash-section-header">
                <h2 className="dash-section-title">Recent transactions</h2>
              </section>

              <section className="tx-list">
                {transactions.map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))}
              </section>
            </section>

        </section>
      </section>
    </section>
  );
}

/* Sub-components remain same */

function StatCard({ icon, label, value, delta, trend }: any) {
  return (
    <section className="stat-card">
      <section className="stat-icon">{icon}</section>
      <p className="stat-label">{label}</p>
      <p className={`stat-value stat-value--${trend}`}>{value}</p>
      <p className="stat-delta">{delta}</p>
    </section>
  );
}

function TransactionRow({ tx, index }: any) {
  return (
    <section className="tx-row" style={{ animationDelay: `${index * 55}ms` }}>
      <section className="tx-left">
        <section className="tx-icon">{tx.icon}</section>
        <section>
          <p className="tx-name">{tx.name}</p>
          <p className="tx-meta">{tx.date} · {tx.category}</p>
        </section>
      </section>
      <section className={`tx-amount tx-amount--${tx.type}`}>
        {tx.type === 'debit' ? '−' : '+'} R {tx.amount.toFixed(2)}
      </section>
    </section>
  );
}

function KuduIcon() {
  return (
    <svg width="28" height="28">
      <rect width="28" height="28" rx="8" fill="#FFB81C" />
    </svg>
  );
}