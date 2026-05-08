import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Trophy,
  Flame,
  Sparkles,
  Calendar,
  Send,
  Heart,
  MessageCircle,
  Plus,
  Users,
  ChevronLeft,
  ImagePlus,
  ShieldCheck,
  Check,
  RotateCcw,
  Clock,
  X,
  Inbox,
  Smile,
  Target,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { demoStore, MOCK_TEAM } from '@/lib/paacMockData';
import { athivarStore } from '@/lib/athivarMockData';
import { evolutionStore } from '@/lib/evolutionMockData';

// ============================================================
// HELPERS
// ============================================================

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return iso;
  }
};

const fmtRelative = (iso) => {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return 'agora';
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return fmtDate(iso);
};

const initials = (name) =>
  (name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-bold text-ink-900 mt-1 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ============================================================
// HERO
// ============================================================

function Hero({ role, challenges, pendingCount, onCreateChallenge }) {
  const activeCount = challenges.filter((c) => c.status === 'active').length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-grid text-white p-5 sm:p-8 md:p-10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300/80">
            Etapa 4 · Athivar
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
            Desafios coletivos que viram histórias para o time inteiro.
          </h1>
          <p className="text-ink-200/80 mt-3 text-sm leading-relaxed">
            Lance um desafio, todo mundo executa em campo e posta o resultado.
            O gestor aprova antes de publicar no feed — depois é só vibrar com o time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur">
            <div className="flex items-center gap-1.5 text-gold-300/80">
              <Flame className="w-3.5 h-3.5" />
              <p className="text-[10px] uppercase tracking-wider font-semibold">
                Ativos
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-white mt-1">
              {activeCount}
            </p>
          </div>
          {role === 'gestor' && (
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur">
              <div className="flex items-center gap-1.5 text-gold-300/80">
                <Inbox className="w-3.5 h-3.5" />
                <p className="text-[10px] uppercase tracking-wider font-semibold">
                  Pra aprovar
                </p>
              </div>
              <p className="font-display text-2xl font-bold text-white mt-1">
                {pendingCount}
              </p>
            </div>
          )}
        </div>
      </div>

      {role === 'gestor' && (
        <div className="relative mt-5 sm:mt-6">
          <Button
            onClick={onCreateChallenge}
            className="w-full sm:w-auto bg-gold-shine text-ink-900 hover:opacity-90 font-semibold gap-2 shadow-gold h-11"
          >
            <Plus className="w-4 h-4" />
            Lançar novo desafio
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CHALLENGE CARD
// ============================================================

function ChallengeCard({ challenge, metrics, onClick }) {
  const isClosed = challenge.status === 'closed';
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white border border-ink-100 rounded-2xl p-5 shadow-sm hover:shadow-soft hover:border-gold-300 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">{challenge.cover_emoji || '🎯'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isClosed
                  ? 'bg-ink-100 text-ink-500'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isClosed ? 'Encerrado' : 'Ativo'}
            </span>
            <span className="text-[11px] text-ink-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              até {fmtDate(challenge.deadline)}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-ink-900 mt-2 leading-snug line-clamp-2">
            {challenge.title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-ink-100">
        <Metric icon={Users} value={metrics.participants_count} label="reps" />
        <Metric icon={MessageCircle} value={metrics.posts_count} label="posts" />
        <Metric
          icon={TrendingUp}
          value={metrics.sum_value}
          label={challenge.metric_unit || 'total'}
        />
      </div>
    </button>
  );
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-ink-400">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <p className="font-display text-lg font-bold text-ink-900 mt-0.5 leading-none">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// POST CARD
// ============================================================

function PostCard({ post, currentEmail, onLike, onComment, statusBadge, footerExtra }) {
  const liked = post.likes.includes(currentEmail);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment?.(post, commentText.trim());
    setCommentText('');
    setShowCommentBox(false);
  };

  return (
    <article className="bg-white border border-ink-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-3 sm:p-4 border-b border-ink-50 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 border border-gold-200 shrink-0">
            <AvatarFallback className="bg-ink-900 text-gold-200 font-semibold text-xs">
              {initials(post.author_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900 leading-tight truncate">
              {post.author_name}
            </p>
            <p className="text-[11px] text-ink-400 truncate">
              {post.author_team} · {fmtRelative(post.created_at)}
            </p>
          </div>
        </div>
        {statusBadge && <div className="shrink-0">{statusBadge}</div>}
      </header>

      {/* Body */}
      <div className="p-4 space-y-3 text-sm">
        <Block label="Situação" text={post.situacao} />
        <Block label="Objetivo" text={post.objetivo} />
        <Block label="Resultado" text={post.resultado} accent />
        {post.result_value != null && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {post.result_value} {post.challenge_unit || ''}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="bg-ink-50">
          <img
            src={post.image_url}
            alt="evidência"
            className="w-full max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Reactions footer */}
      <footer className="border-t border-ink-50">
        {post.status === 'published' && (
          <div className="flex items-center gap-1 px-2 py-1.5">
            <button
              onClick={() => onLike?.(post)}
              className={`flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg text-sm transition-colors ${
                liked
                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                  : 'text-ink-500 hover:bg-paper-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{post.likes.length}</span>
            </button>
            <button
              onClick={() => setShowCommentBox((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg text-sm text-ink-500 hover:bg-paper-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post.comments.length}</span>
            </button>
          </div>
        )}

        {post.comments.length > 0 && (
          <div className="px-4 py-3 space-y-2 border-t border-ink-50 bg-paper-50/50">
            {post.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-ink-100 text-ink-700 text-[10px] font-semibold">
                    {initials(c.author_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-ink-100">
                  <p className="text-xs font-semibold text-ink-900">
                    {c.author_name}
                    <span className="text-[10px] text-ink-400 font-normal ml-2">
                      {fmtRelative(c.created_at)}
                    </span>
                  </p>
                  <p className="text-sm text-ink-700 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCommentBox && post.status === 'published' && (
          <div className="p-3 border-t border-ink-50 flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreva um comentário…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitComment();
                }
              }}
              autoFocus
            />
            <Button onClick={submitComment} size="sm" className="bg-ink-900">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {footerExtra}
      </footer>
    </article>
  );
}

function Block({ label, text, accent }) {
  if (!text) return null;
  return (
    <div>
      <p
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          accent ? 'text-emerald-700' : 'text-ink-400'
        }`}
      >
        {label}
      </p>
      <p className="text-ink-700 mt-0.5 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

// ============================================================
// CHALLENGE DETAIL
// ============================================================

function ChallengeDetail({
  challenge,
  posts,
  metrics,
  role,
  currentEmail,
  onBack,
  onReport,
  onLike,
  onComment,
}) {
  const isParticipant = challenge.participants.includes(currentEmail);

  // anexa unit pros posts pra render
  const decoratedPosts = posts.map((p) => ({
    ...p,
    challenge_unit: challenge.metric_unit,
  }));

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para todos os desafios
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-3xl sm:text-4xl">{challenge.cover_emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200">
                {challenge.status === 'active' ? 'Ativo' : 'Encerrado'}
              </span>
              <span className="text-[11px] text-ink-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                até {fmtDate(challenge.deadline)}
              </span>
              <span className="text-[11px] text-ink-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="truncate max-w-[140px] sm:max-w-none">{challenge.created_by_name}</span>
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight mt-2 leading-tight">
              {challenge.title}
            </h2>
            <p className="text-ink-200/80 text-sm mt-2 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5 text-gold-300/80">
              <Users className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Participantes
              </span>
            </div>
            <p className="font-display text-xl font-bold mt-1">
              {metrics.participants_count}
              <span className="text-xs text-ink-300 font-normal">
                {' '}
                / {challenge.participants.length}
              </span>
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5 text-gold-300/80">
              <MessageCircle className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Posts
              </span>
            </div>
            <p className="font-display text-xl font-bold mt-1">
              {metrics.posts_count}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5 text-gold-300/80">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                {challenge.metric_label || 'Total'}
              </span>
            </div>
            <p className="font-display text-xl font-bold mt-1">
              {metrics.sum_value}{' '}
              <span className="text-xs text-ink-300 font-normal">
                {challenge.metric_unit}
              </span>
            </p>
          </div>
        </div>

        {role === 'colaborador' && isParticipant && challenge.status === 'active' && (
          <div className="mt-6">
            <Button
              onClick={() => onReport(challenge)}
              className="bg-gold-shine text-ink-900 hover:opacity-90 font-semibold gap-2 shadow-gold"
            >
              <Plus className="w-4 h-4" />
              Reportar minha ação
            </Button>
          </div>
        )}
      </div>

      {/* Feed */}
      <SectionHeader
        eyebrow="Feed do desafio"
        title="Histórias publicadas"
        subtitle={`${decoratedPosts.length} ${
          decoratedPosts.length === 1 ? 'post publicado' : 'posts publicados'
        } pelo time`}
      />

      {decoratedPosts.length === 0 ? (
        <EmptyState
          icon={Smile}
          title="Nenhum post publicado ainda"
          message="Seja a primeira pessoa a contar a sua história neste desafio."
        />
      ) : (
        <div className="grid gap-5">
          {decoratedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentEmail={currentEmail}
              onLike={onLike}
              onComment={onComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="bg-white border border-dashed border-ink-200 rounded-2xl p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper-100 text-ink-400 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-900">
        {title}
      </h3>
      <p className="text-sm text-ink-500 mt-1">{message}</p>
    </div>
  );
}

// ============================================================
// DIALOGS
// ============================================================

function NewChallengeDialog({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    metric_label: '',
    metric_unit: '',
    cover_emoji: '🎯',
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: '',
        description: '',
        deadline: '',
        metric_label: '',
        metric_unit: '',
        cover_emoji: '🎯',
      });
    }
  }, [open]);

  const submit = () => {
    if (!form.title.trim()) return;
    onCreate({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Lançar novo desafio</DialogTitle>
          <DialogDescription>
            Defina o desafio que o time vai executar em campo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Field label="Título">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Aplicar SPIN no ciclo Catapres"
              autoFocus
            />
          </Field>
          <Field label="Descrição (instruções para o time)">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="O que cada um deve fazer e como reportar."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prazo">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>
            <Field label="Emoji da capa">
              <Input
                value={form.cover_emoji}
                onChange={(e) => setForm({ ...form, cover_emoji: e.target.value })}
                maxLength={2}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Métrica (label)">
              <Input
                value={form.metric_label}
                onChange={(e) => setForm({ ...form, metric_label: e.target.value })}
                placeholder="Ex: caixas vendidas"
              />
            </Field>
            <Field label="Unidade">
              <Input
                value={form.metric_unit}
                onChange={(e) => setForm({ ...form, metric_unit: e.target.value })}
                placeholder="Ex: cx"
                maxLength={6}
              />
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            disabled={!form.title.trim()}
            className="bg-ink-900 text-white"
          >
            Lançar desafio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function NewPostDialog({ open, onClose, challenge, onSubmit, initial }) {
  const [form, setForm] = useState({
    situacao: '',
    objetivo: '',
    resultado: '',
    result_value: '',
    image_url: '',
  });
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        situacao: initial?.situacao || '',
        objetivo: initial?.objetivo || '',
        resultado: initial?.resultado || '',
        result_value: initial?.result_value ?? '',
        image_url: initial?.image_url || '',
      });
    }
  }, [open, initial]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Imagem muito grande para a demo (limite ~1.5MB).');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, image_url: dataUrl }));
  };

  const submit = () => {
    if (!form.situacao.trim() || !form.objetivo.trim() || !form.resultado.trim()) return;
    onSubmit(form);
  };

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {initial ? 'Reenviar relato' : 'Reportar minha ação'}
          </DialogTitle>
          <DialogDescription>
            {challenge.cover_emoji} {challenge.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Field label="Situação — O que estava acontecendo?">
            <Textarea
              value={form.situacao}
              onChange={(e) => setForm({ ...form, situacao: e.target.value })}
              rows={3}
              placeholder="Contexto da visita / negociação"
              autoFocus
            />
          </Field>
          <Field label="Objetivo — O que você queria alcançar?">
            <Textarea
              value={form.objetivo}
              onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
              rows={2}
              placeholder="Sua meta para a ação"
            />
          </Field>
          <Field label="Resultado — O que aconteceu?">
            <Textarea
              value={form.resultado}
              onChange={(e) => setForm({ ...form, resultado: e.target.value })}
              rows={3}
              placeholder="Como você executou e o desfecho"
            />
          </Field>
          {challenge.metric_label && (
            <Field label={`Resultado em números (${challenge.metric_label})`}>
              <Input
                type="number"
                min={0}
                value={form.result_value}
                onChange={(e) => setForm({ ...form, result_value: e.target.value })}
                placeholder={`Ex: 8 ${challenge.metric_unit}`}
              />
            </Field>
          )}

          <Field label="Foto / evidência (opcional)">
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                {form.image_url ? 'Trocar imagem' : 'Adicionar imagem'}
              </Button>
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: '' })}
                  className="text-xs text-ink-500 hover:text-rose-600"
                >
                  Remover
                </button>
              )}
            </div>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="mt-3 rounded-lg max-h-44 object-cover border border-ink-200"
              />
            )}
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={submit}
            disabled={
              !form.situacao.trim() || !form.objetivo.trim() || !form.resultado.trim()
            }
            className="bg-ink-900 text-white gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar para validação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewPostDialog({ open, onClose, post, onApprove, onRework }) {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (open) setFeedback('');
  }, [open]);

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Revisar post</DialogTitle>
          <DialogDescription>
            Aprovar publica no feed; pedir ajuste devolve ao colaborador com seu feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-paper-50 rounded-xl border border-ink-100 p-4 max-h-72 overflow-y-auto space-y-3">
          <div>
            <p className="text-xs font-semibold text-ink-900">{post.author_name}</p>
            <p className="text-[11px] text-ink-400">
              {fmtRelative(post.created_at)}
            </p>
          </div>
          <Block label="Situação" text={post.situacao} />
          <Block label="Objetivo" text={post.objetivo} />
          <Block label="Resultado" text={post.resultado} accent />
          {post.result_value != null && (
            <p className="text-xs text-emerald-700 font-semibold">
              Resultado em números: {post.result_value}
            </p>
          )}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="evidência"
              className="rounded-lg max-h-48 object-cover w-full"
            />
          )}
        </div>

        <Field label="Feedback (necessário só para 'Pedir ajuste')">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Ex: faltou colocar dados de quem participou."
          />
        </Field>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onRework(post, feedback)}
            disabled={!feedback.trim()}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Pedir ajuste
          </Button>
          <Button
            onClick={() => onApprove(post)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <Check className="w-4 h-4" />
            Publicar no feed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Athivar() {
  const [tick, setTick] = useState(0);
  const [role, setRole] = useState(demoStore.getRole());
  const [user, setUser] = useState(demoStore.getCurrentUser());

  const [tab, setTab] = useState('challenges');
  const [selectedId, setSelectedId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportInitial, setReportInitial] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const reload = () => {
      setTick((t) => t + 1);
      setRole(demoStore.getRole());
      setUser(demoStore.getCurrentUser());
    };
    window.addEventListener('athivar-change', reload);
    window.addEventListener('paac-role-change', reload);
    return () => {
      window.removeEventListener('athivar-change', reload);
      window.removeEventListener('paac-role-change', reload);
    };
  }, []);

  // garante que tab selecionada faz sentido para o role
  useEffect(() => {
    if (role === 'colaborador' && tab === 'pending') setTab('challenges');
  }, [role, tab]);

  const challenges = useMemo(
    () => athivarStore.getChallenges(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const pending = useMemo(
    () => athivarStore.getPendingPosts(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );
  const myPosts = useMemo(
    () => athivarStore.getPostsByAuthor(user.email),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, user.email]
  );

  const challengesById = useMemo(() => {
    const m = {};
    challenges.forEach((c) => (m[c.id] = c));
    return m;
  }, [challenges]);

  const showToast = (msg, Icon = Sparkles) => {
    setToast({ msg, Icon, id: Date.now() });
    setTimeout(() => setToast(null), 2200);
  };

  // Handlers
  const handleCreateChallenge = (data) => {
    const created = athivarStore.createChallenge(data);
    setCreateOpen(false);
    showToast(`Desafio "${created.title}" lançado`, Trophy);
  };

  const handleSubmitPost = (data) => {
    if (reportInitial?.id) {
      athivarStore.resubmitPost(reportInitial.id, data);
      showToast('Relato reenviado para validação', Send);
    } else {
      athivarStore.submitPost(reportTarget.id, {
        author_email: user.email,
        ...data,
      });
      showToast('Relato enviado — aguardando aprovação do gestor', Send);
    }
    setReportTarget(null);
    setReportInitial(null);
  };

  const handleApprove = (post) => {
    const updated = athivarStore.approvePost(post.id);
    if (updated) {
      const ch = athivarStore.getChallenge(post.challenge_id);
      evolutionStore.addImprovement(post.author_email, {
        date: updated.approved_at,
        title: ch?.title || 'Desafio Athivar',
        description: `Post publicado: "${post.resultado.substring(0, 120)}"`,
        category: 'campo',
      });
      showToast(`Post de ${post.author_name} publicado no feed`, Check);
    }
    setReviewTarget(null);
  };

  const handleRework = (post, feedback) => {
    athivarStore.requestPostRework(post.id, feedback);
    setReviewTarget(null);
    showToast('Ajuste solicitado ao colaborador', RotateCcw);
  };

  const handleLike = (post) => {
    athivarStore.toggleLike(post.id, user.email);
  };

  const handleComment = (post, text) => {
    athivarStore.addComment(post.id, {
      author_email: user.email,
      author_name: user.full_name,
      text,
    });
  };

  const openReport = (challenge, initial = null) => {
    setReportTarget(challenge);
    setReportInitial(initial);
  };

  const selected = selectedId ? challengesById[selectedId] : null;

  // ----- RENDER -----

  if (selected) {
    const detailPosts = athivarStore.getPostsByChallenge(selected.id, {
      onlyPublished: true,
    });
    const metrics = athivarStore.getChallengeMetrics(selected.id);
    return (
      <div className="space-y-8 min-h-[80vh]">
        <ChallengeDetail
          challenge={selected}
          posts={detailPosts}
          metrics={metrics}
          role={role}
          currentEmail={user.email}
          onBack={() => setSelectedId(null)}
          onReport={(c) => openReport(c)}
          onLike={handleLike}
          onComment={handleComment}
        />

        <NewPostDialog
          open={!!reportTarget}
          challenge={reportTarget}
          initial={reportInitial}
          onClose={() => {
            setReportTarget(null);
            setReportInitial(null);
          }}
          onSubmit={handleSubmitPost}
        />

        <ToastBar toast={toast} />
      </div>
    );
  }

  return (
    <div className="space-y-10 min-h-[80vh]">
      <Hero
        role={role}
        challenges={challenges}
        pendingCount={pending.length}
        onCreateChallenge={() => setCreateOpen(true)}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-ink-100 overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabBtn
          active={tab === 'challenges'}
          onClick={() => setTab('challenges')}
          icon={Target}
          label="Desafios"
        />
        {role === 'gestor' && (
          <TabBtn
            active={tab === 'pending'}
            onClick={() => setTab('pending')}
            icon={Inbox}
            label="Aprovações"
            badge={pending.length || null}
          />
        )}
        <TabBtn
          active={tab === 'mine'}
          onClick={() => setTab('mine')}
          icon={Smile}
          label="Meu mural"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {tab === 'challenges' && (
            <>
              <SectionHeader
                eyebrow="Em andamento"
                title="Desafios do distrito"
                subtitle="Clique num desafio para ver o feed e participar."
              />
              {challenges.length === 0 ? (
                <EmptyState
                  icon={Target}
                  title="Nenhum desafio ainda"
                  message={
                    role === 'gestor'
                      ? 'Lance o primeiro desafio para o time pelo botão acima.'
                      : 'Aguarde o gestor lançar um desafio.'
                  }
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.map((c) => (
                    <ChallengeCard
                      key={c.id}
                      challenge={c}
                      metrics={athivarStore.getChallengeMetrics(c.id)}
                      onClick={() => setSelectedId(c.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'pending' && role === 'gestor' && (
            <>
              <SectionHeader
                eyebrow="Caixa de entrada"
                title="Posts aguardando aprovação"
                subtitle={`${pending.length} ${
                  pending.length === 1 ? 'post' : 'posts'
                } para revisar`}
              />
              {pending.length === 0 ? (
                <EmptyState
                  icon={Check}
                  title="Tudo em dia!"
                  message="Nenhum post pendente de aprovação."
                />
              ) : (
                <div className="grid gap-5">
                  {pending.map((post) => {
                    const ch = challengesById[post.challenge_id];
                    return (
                      <PostCard
                        key={post.id}
                        post={{ ...post, challenge_unit: ch?.metric_unit }}
                        currentEmail={user.email}
                        statusBadge={
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 text-amber-700 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendente
                          </span>
                        }
                        footerExtra={
                          <div className="p-3 border-t border-ink-50 flex items-center justify-between gap-3 bg-paper-50/50">
                            <p className="text-[11px] text-ink-500">
                              Desafio: <strong>{ch?.title}</strong>
                            </p>
                            <Button
                              size="sm"
                              onClick={() => setReviewTarget(post)}
                              className="bg-ink-900"
                            >
                              Revisar
                            </Button>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'mine' && (
            <>
              <SectionHeader
                eyebrow="Seu histórico"
                title="Meus posts"
                subtitle="Acompanhe o que você já publicou e o que ainda está em aprovação."
              />
              {myPosts.length === 0 ? (
                <EmptyState
                  icon={Smile}
                  title="Nada por aqui ainda"
                  message="Entre num desafio e clique em 'Reportar minha ação' para começar."
                />
              ) : (
                <div className="grid gap-5">
                  {myPosts.map((post) => {
                    const ch = challengesById[post.challenge_id];
                    const badge =
                      post.status === 'published' ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Publicado
                        </span>
                      ) : post.status === 'pending_approval' ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 text-amber-700 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Aguardando
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-rose-100 text-rose-700 inline-flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Ajustar
                        </span>
                      );

                    const extra =
                      post.status === 'needs_rework' ? (
                        <div className="p-4 border-t border-ink-50 bg-rose-50">
                          <p className="text-[11px] uppercase font-semibold tracking-wider text-rose-700">
                            Feedback do gestor
                          </p>
                          <p className="text-sm text-rose-800 mt-1">
                            {post.feedback}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => openReport(ch, post)}
                            className="bg-rose-600 hover:bg-rose-700 text-white mt-3 gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Ajustar e reenviar
                          </Button>
                        </div>
                      ) : null;

                    return (
                      <PostCard
                        key={post.id}
                        post={{ ...post, challenge_unit: ch?.metric_unit }}
                        currentEmail={user.email}
                        statusBadge={badge}
                        footerExtra={extra}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dialogs */}
      <NewChallengeDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateChallenge}
      />
      <NewPostDialog
        open={!!reportTarget}
        challenge={reportTarget}
        initial={reportInitial}
        onClose={() => {
          setReportTarget(null);
          setReportInitial(null);
        }}
        onSubmit={handleSubmitPost}
      />
      <ReviewPostDialog
        open={!!reviewTarget}
        post={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onApprove={handleApprove}
        onRework={handleRework}
      />

      <ToastBar toast={toast} />
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0 ${
        active
          ? 'border-gold-500 text-ink-900'
          : 'border-transparent text-ink-500 hover:text-ink-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {badge ? (
        <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function ToastBar({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 bg-ink-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-sm"
        >
          <toast.Icon className="w-4 h-4 text-gold-300" />
          <span className="text-sm font-medium">{toast.msg}</span>
          <button
            onClick={() => null}
            className="ml-2 text-ink-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
