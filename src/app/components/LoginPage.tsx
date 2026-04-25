import { Send } from 'lucide-react';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-12 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-200 hover:border-primary-glow/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 24L16 8L24 24L20 22L16 14L12 22L8 24Z" fill="white" opacity="0.9"/>
                  <path d="M12 22L16 14L20 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-[32px] font-bold text-text-primary mb-2">GlideOne</h1>
              <p className="text-text-secondary">Automate. Moderate. Grow.</p>
            </div>

            <div className="space-y-6 pt-4">
              <button
                onClick={onLogin}
                className="w-full h-12 bg-[#0088CC] hover:bg-[#0077B3] text-white rounded-[var(--radius-sm)] font-medium flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                Sign in with Telegram
              </button>

              <p className="text-text-muted text-xs">
                Your groups, fully under control
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Secure
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Private
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              No password required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
