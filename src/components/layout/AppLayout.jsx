import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Trophy,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  LifeBuoy,
  UserCog,
} from 'lucide-react';
import { demoStore } from '@/lib/paacMockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';

const DEFAULT_COMPANY = {
  name: 'Morente Academy',
  logo_url: null,
  primary_color: '#0b1120',
};

const JOURNEY = [
  { icon: Target, label: 'Scanner', path: 'Scanner', tagline: 'Diagnóstico' },
  { icon: Users, label: 'Lidherar', path: 'Lidherar', tagline: 'Fundação' },
  { icon: BookOpen, label: 'Academy', path: 'Academy', tagline: 'Aprendizado' },
  { icon: Trophy, label: 'Athivar', path: 'Athivar', tagline: 'Prática' },
  { icon: BarChart3, label: 'Evoluthion', path: 'Evoluthion', tagline: 'Evolução' },
];

const PRIMARY = [
  { icon: LayoutDashboard, label: 'Dashboard', path: 'Dashboard' },
];

function Monogram() {
  return (
    <div className="relative h-10 w-10 rounded-xl bg-gold-shine shadow-gold flex items-center justify-center shrink-0">
      <span className="font-display text-ink-900 text-lg font-bold leading-none">M</span>
    </div>
  );
}

function JourneyRail({ currentPageName, isOpen }) {
  const currentIndex = JOURNEY.findIndex((s) => s.path === currentPageName);

  return (
    <div className={`px-3 ${isOpen ? 'py-3' : 'py-3'}`}>
      {isOpen && (
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-300/60 mb-2">
          Sua Jornada
        </p>
      )}
      <div className="relative">
        {JOURNEY.map((stage, idx) => {
          const isActive = currentPageName === stage.path;
          const isPast = currentIndex > idx && currentIndex !== -1;
          const Icon = stage.icon;
          return (
            <div key={stage.path} className="relative">
              {idx < JOURNEY.length - 1 && (
                <span
                  className={`absolute left-[22px] top-10 w-px h-5 transition-colors ${
                    isPast || isActive ? 'bg-gold-400/70' : 'bg-ink-700/60'
                  }`}
                />
              )}
              <Link
                to={createPageUrl(stage.path)}
                title={!isOpen ? stage.label : ''}
                className={`relative flex items-center gap-3 py-2 px-2 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-50'
                    : 'text-ink-300 hover:text-gold-100'
                }`}
              >
                <span
                  className={`relative h-9 w-9 shrink-0 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-gold-400 border-gold-400 text-ink-900 shadow-gold'
                      : isPast
                      ? 'bg-ink-700 border-gold-400/60 text-gold-200'
                      : 'bg-ink-800 border-ink-600 text-ink-400 group-hover:border-gold-400/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                {isOpen && (
                  <div className="flex flex-col leading-tight min-w-0 flex-1">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isActive ? 'text-white' : 'text-ink-100'
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[11px] text-ink-400/80 truncate">
                      {stage.tagline}
                    </span>
                  </div>
                )}
                {isOpen && isActive && (
                  <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AppLayout({ children, currentPageName }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [realUser, setRealUser] = useState(null);
  const [role, setRole] = useState(demoStore.getRole());
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const location = useLocation();
  const navigate = useNavigate();

  // Usuário exibido = usuário real do backend OU o perfil simulado pelo demo
  const demoUser = demoStore.getCurrentUser();
  const user = realUser || {
    ...demoUser,
    role: role === 'gestor' ? 'super_admin' : 'colaborador',
  };

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser) {
          const profiles = await base44.entities.UserProfile.list({
            user_email: currentUser.email,
          });
          if (profiles.length > 0) {
            const profile = profiles[0];
            setRealUser({ ...currentUser, ...profile });
            if (profile.company_id) {
              const companyData = await base44.entities.Company.get(
                profile.company_id
              );
              if (companyData) setCompany(companyData);
            }
          } else {
            setRealUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    fetchUserAndCompany();

    const handler = (e) => setRole(e.detail);
    window.addEventListener('paac-role-change', handler);
    return () => window.removeEventListener('paac-role-change', handler);
  }, []);

  const handleLogout = () => {
    demoStore.logout();
    navigate('/Login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper-grid font-sans flex text-ink-900">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-950/60 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out flex flex-col bg-ink-grid border-r border-ink-800/80
          ${
            isSidebarOpen
              ? 'w-64 translate-x-0'
              : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
          }
        `}
      >
        <div className="h-20 flex items-center px-5 border-b border-ink-800/80">
          <div className="flex items-center gap-3 text-white min-w-0">
            <Monogram />
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold tracking-tight text-white truncate leading-none">
                  {company.name}
                </p>
                <p className="text-[11px] text-gold-200/70 mt-1 tracking-wider uppercase">
                  Desenvolvimento de Líderes
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
          <div className="px-3 mb-2">
            {PRIMARY.map((item) => {
              const isActive = currentPageName === item.path;
              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  title={!isSidebarOpen ? item.label : ''}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-ink-800 text-white shadow-inner'
                      : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mx-3 my-3 border-t border-ink-800/80" />

          <JourneyRail currentPageName={currentPageName} isOpen={isSidebarOpen} />
        </nav>

        <div className="p-3 border-t border-ink-800/80">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-ink-800/70 transition-colors">
                <Avatar className="h-9 w-9 border-2 border-gold-400/30">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-gold-500 text-ink-900 font-semibold">
                    {user?.full_name?.substring(0, 2).toUpperCase() || 'EU'}
                  </AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={user?.email || 'anon'}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="flex-1 text-left overflow-hidden"
                    >
                      <p className="text-sm font-medium text-white truncate">
                        {user?.full_name || 'Colaborador'}
                      </p>
                      <p className="text-[11px] text-gold-200/70 truncate uppercase tracking-wider">
                        {user?.role === 'super_admin'
                          ? 'Gestor'
                          : user?.role === 'colaborador'
                          ? 'Colaborador'
                          : user?.role || 'Membro'}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}
                {isSidebarOpen && <ChevronDown className="w-4 h-4 text-ink-400" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = createPageUrl('Profile'))}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Perfil e Preferências
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = createPageUrl('Support'))}
              >
                <LifeBuoy className="w-4 h-4 mr-2" />
                Suporte
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur border-b border-ink-100 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-ink-500 hover:text-ink-900"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden md:flex relative max-w-md w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="Buscar cursos, competências, colegas…"
                className="w-full pl-10 pr-4 py-2.5 bg-paper-50 border border-ink-100 rounded-full text-sm placeholder:text-ink-400 focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none transition-all"
              />
              <kbd className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400 bg-white border border-ink-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-ink-500 hover:text-ink-900 hover:bg-paper-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full ring-2 ring-white" />
            </Button>
            {user?.role === 'super_admin' && (
              <Button
                variant="outline"
                className="hidden md:flex gap-2 border-ink-200 hover:border-gold-400 hover:text-gold-700"
                onClick={() => (window.location.href = createPageUrl('AdminPanel'))}
              >
                <Settings className="w-4 h-4" /> Admin
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin bg-paper-grid p-6 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${location.pathname}-${role}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-7xl mx-auto space-y-8 pb-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
