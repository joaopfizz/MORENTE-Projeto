import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, UserCircle2, Eye, EyeOff, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoStore, DEMO_ACCOUNTS } from '@/lib/paacMockData';
import { createPageUrl } from '@/utils';

const ROLE_LABEL = { gestor: 'Gestor', colaborador: 'Colaborador' };
const ACCOUNT_NAME = {
  'carla.souza@arese.com.br': 'Carla Souza',
  'rafael.mendes@arese.com.br': 'Rafael Mendes',
};

const QUICK_ACCOUNTS = [
  {
    email: 'carla.souza@arese.com.br',
    name: 'Carla Souza',
    role: 'Gestor',
    description: 'Gerente Distrital · Distrito SP-Interior',
    Icon: Crown,
    accent: 'from-gold-400/30 to-gold-500/10 border-gold-400/40 text-gold-200',
  },
  {
    email: 'rafael.mendes@arese.com.br',
    name: 'Rafael Mendes',
    role: 'Colaborador',
    description: 'Representante · Setor 087 - Campinas/SP',
    Icon: UserCircle2,
    accent: 'from-white/15 to-white/5 border-white/20 text-white',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [transition, setTransition] = useState(null); // { name, role } | null

  const submit = (rawEmail) => {
    if (transition) return;
    const target = (rawEmail ?? email).trim().toLowerCase();
    if (!target) {
      setError('Informe um e-mail.');
      return;
    }
    const role = DEMO_ACCOUNTS[target];
    if (!role) {
      setError('E-mail não reconhecido. Use uma das contas demo abaixo.');
      return;
    }
    setTransition({ name: ACCOUNT_NAME[target] || target, role });
    setTimeout(() => {
      demoStore.login(target);
      navigate(createPageUrl('Dashboard'));
    }, 1100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="min-h-screen w-full bg-ink-grid text-white flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      <AnimatePresence>
        {transition && (
          <motion.div
            key="login-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
              className="flex flex-col items-center gap-5 text-center px-6"
            >
              <div className="relative h-16 w-16">
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gold-shine shadow-gold flex items-center justify-center"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="font-display text-ink-900 text-2xl font-bold leading-none">E</span>
                </motion.div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300/80">
                  {ROLE_LABEL[transition.role]} · Entheus
                </p>
                <p className="font-display text-xl font-semibold text-white mt-2">
                  Bem-vindo, {transition.name.split(' ')[0]}.
                </p>
                <p className="text-sm text-ink-300 mt-1">Preparando a sua jornada…</p>
              </div>
              <Loader2 className="w-5 h-5 text-gold-300 animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Lado esquerdo — branding */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:flex flex-col gap-6 pr-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gold-shine shadow-gold flex items-center justify-center">
              <span className="font-display text-ink-900 text-2xl font-bold leading-none">E</span>
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-white">
                Entheus
              </p>
              <p className="text-[11px] text-gold-200/70 mt-0.5 tracking-wider uppercase">
                Desenvolvimento de Líderes
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300/80">
              Plataforma Arese · Linha Cardio
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white mt-3 leading-tight">
              A jornada de liderança começa com o autoconhecimento.
            </h1>
            <p className="text-ink-200/80 mt-4 text-sm leading-relaxed">
              Diagnóstico em campo (PAAC), formação contínua, missões com gamificação e visão
              consolidada da evolução do time — tudo em um só lugar.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gold-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ambiente de demonstração</span>
          </div>
        </motion.div>

        {/* Lado direito — form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-paper-50 text-ink-900 rounded-2xl shadow-2xl border border-ink-100 p-6 sm:p-8"
        >
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gold-shine shadow-gold flex items-center justify-center">
              <span className="font-display text-ink-900 text-lg font-bold leading-none">E</span>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-ink-900">Entheus</p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Desenvolvimento de Líderes</p>
            </div>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Bem-vindo de volta
          </p>
          <h2 className="font-display text-2xl font-bold text-ink-900 mt-1">Entrar na conta</h2>
          <p className="text-sm text-ink-500 mt-2">
            Use uma das contas de demonstração para visualizar o app como gestor ou como colaborador.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="seu.email@arese.com.br"
                className="h-11 bg-white border-ink-200 focus-visible:ring-gold-400/40 focus-visible:border-gold-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 bg-white border-ink-200 pr-10 focus-visible:ring-gold-400/40 focus-visible:border-gold-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-ink-400 mt-1.5">
                Demo: qualquer senha é aceita.
              </p>
            </div>

            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!!transition}
              className="w-full h-11 bg-ink-900 hover:bg-ink-800 text-white font-semibold gap-2 disabled:opacity-70"
            >
              {transition ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-paper-50 px-3 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                  Acesso rápido (demo)
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              {QUICK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => submit(acc.email)}
                  disabled={!!transition}
                  className="group flex items-center gap-3 w-full text-left p-3 rounded-lg border border-ink-200 bg-white hover:border-gold-400 hover:shadow-soft transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="h-9 w-9 rounded-full bg-ink-900 text-gold-200 flex items-center justify-center shrink-0">
                    <acc.Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink-900 truncate">{acc.name}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-700">
                        {acc.role}
                      </span>
                    </span>
                    <span className="block text-[11px] text-ink-500 truncate">{acc.email}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-gold-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
