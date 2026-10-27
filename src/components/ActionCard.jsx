import React from 'react';
import {
  Send,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function ActionCard({ message }) {
  const { executeAction, currentProfile } = useChat();
  const data = message.data;

  if (!data || !data.is_banking_related) return null;

  const category = data.category;
  const intent = data.detected_intent;
  const entities = data.entities || {};
  const isCompleted = message.actionState?.completed;

  // 1. Funds Transfer Action Card
  if (category === 'funds_transfer' || intent === 'transfer_funds') {
    const amount = entities.amount || 250.0;
    const recipient = entities.recipient || 'Selected Payee';
    const currency = entities.currency || 'USD';

    return (
      <div className="action-card transfer">
        <div className="action-card-header">
          <div className="action-card-title" style={{ color: 'var(--accent-cyan)' }}>
            <Send size={15} />
            <span>Transfer Verification & Authorization</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Agent 2: Account Specialist
          </span>
        </div>

        <div className="action-card-fields">
          <div className="action-field">
            <span className="action-field-label">Transfer Amount</span>
            <span className="action-field-val" style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem' }}>
              ${amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Recipient</span>
            <span className="action-field-val">{recipient}</span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Source Account</span>
            <span className="action-field-val">
              {entities.account_type || 'Checking'} ({currentProfile.accountNumber})
            </span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Available Balance</span>
            <span className="action-field-val">
              ${currentProfile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {isCompleted ? (
          <div className="action-confirmed-banner">
            <CheckCircle2 size={16} />
            <span>Transfer of ${amount.toFixed(2)} sent successfully! Ref: {message.actionState.txId}</span>
          </div>
        ) : (
          <button
            className="btn-action-primary"
            onClick={() => executeAction('transfer', { amount, recipient }, message.id)}
          >
            <span>Authorize & Send Transfer</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    );
  }

  // 2. Emergency Card Lock Action Card
  if (category === 'cards_and_security' || intent?.includes('card') || intent?.includes('block')) {
    const cardLastFour = entities.card_last_four || currentProfile.activeCard.replace('•••• ', '');
    const isLocked = isCompleted || message.actionState?.status === 'LOCKED';

    return (
      <div className="action-card card-lock">
        <div className="action-card-header">
          <div className="action-card-title" style={{ color: 'var(--accent-rose)' }}>
            <ShieldAlert size={15} />
            <span>Card Security Defense Protocol</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#fda4af', fontWeight: 700 }}>
            CRITICAL URGENCY
          </span>
        </div>

        <div className="action-card-fields">
          <div className="action-field">
            <span className="action-field-label">Target Card</span>
            <span className="action-field-val">Visa Platinum Debit (•••• {cardLastFour})</span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Current Protection</span>
            <span className="action-field-val" style={{ color: isLocked ? 'var(--accent-rose)' : '#f59e0b' }}>
              {isLocked ? '🔒 CARD FROZEN' : 'Active (Pending Lock)'}
            </span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Cardholder</span>
            <span className="action-field-val">{currentProfile.name}</span>
          </div>
          <div className="action-field">
            <span className="action-field-label">Action</span>
            <span className="action-field-val">Instant 0-Second Freeze</span>
          </div>
        </div>

        {isLocked ? (
          <div className="action-confirmed-banner" style={{ background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fda4af' }}>
            <Lock size={15} />
            <span>Card •••• {cardLastFour} is now FROZEN. All incoming charges are blocked. Case #{message.actionState?.txId}</span>
          </div>
        ) : (
          <button
            className="btn-action-danger"
            onClick={() => executeAction('lock_card', { cardLastFour }, message.id)}
          >
            <Lock size={14} />
            <span>Confirm Immediate Emergency Freeze</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Balance Snapshot Action Card
  if (category === 'account_services' || intent === 'check_balance' || intent === 'view_statement') {
    return (
      <div className="action-card balance">
        <div className="action-card-header">
          <div className="action-card-title" style={{ color: 'var(--accent-emerald)' }}>
            <Wallet size={15} />
            <span>Live Account Portfolio Snapshot</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Real-time Core Banking Sync
          </span>
        </div>

        <div className="action-card-fields">
          <div className="action-field">
            <span className="action-field-label">Primary Checking</span>
            <span className="action-field-val" style={{ color: 'var(--accent-emerald)', fontSize: '1.05rem' }}>
              ${currentProfile.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="action-field">
            <span className="action-field-label">High-Yield Savings (4.75% APY)</span>
            <span className="action-field-val">
              ${currentProfile.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-ghost"
            style={{ fontSize: '0.74rem', padding: '6px 12px' }}
            onClick={() => alert(`Downloading PDF Statement for account ${currentProfile.accountNumber}...`)}
          >
            <FileText size={13} />
            <span>Download e-Statement (PDF)</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
