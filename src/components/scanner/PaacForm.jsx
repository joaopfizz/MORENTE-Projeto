import React, { useState } from 'react';
import { ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PAAC_DEMANDA, PAAC_PDV, SCORE_LABEL, calcScore, generateTasks } from '@/lib/paacConfig';

const SCORE_OPTS = ['N', 'A', 'S'];

const SCORE_STYLE = {
  N: {
    active: 'bg-rose-600 text-white border-rose-600',
    idle: 'border-rose-200 text-rose-500 hover:bg-rose-50',
  },
  A: {
    active: 'bg-amber-500 text-white border-amber-500',
    idle: 'border-amber-200 text-amber-600 hover:bg-amber-50',
  },
  S: {
    active: 'bg-emerald-600 text-white border-emerald-600',
    idle: 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
  },
};

function ScoreButton({ value, selected, onChange }) {
  const s = SCORE_STYLE[value];
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      title={SCORE_LABEL[value]}
      className={`h-9 w-9 rounded-lg border-2 text-sm font-bold transition-all ${
        selected === value ? s.active : s.idle
      }`}
    >
      {value}
    </button>
  );
}

function CriteriaRow({ crit, score, onChange }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-ink-100 last:border-none group">
      <p className="flex-1 text-sm text-ink-700 leading-relaxed group-hover:text-ink-900 transition-colors">
        {crit.label}
      </p>
      <div className="flex items-center gap-1.5 shrink-0">
        {SCORE_OPTS.map((v) => (
          <ScoreButton key={v} value={v} selected={score} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

export default function PaacForm({ rep, type, onSave, onCancel, saving }) {
  const config = type === 'demanda' ? PAAC_DEMANDA : PAAC_PDV;
  const [scores, setScores] = useState({});
  const [combinados, setCombinados] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const setScore = (key, val) =>
    setScores((prev) => ({ ...prev, [key]: val }));

  const totalCriteria = config.flatMap((s) =>
    s.subsections.flatMap((sub) => sub.criteria)
  ).length;
  const filled = Object.keys(scores).length;
  const progress = Math.round((filled / totalCriteria) * 100);

  const handleSave = (status) => {
    const tasks = status === 'completed' ? generateTasks(scores, config) : [];
    onSave({ scores, combinados, evaluation_date: date, status, tasks });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-700 font-semibold">
            PAAC {type === 'demanda' ? 'Demanda' : 'PDV'}
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {rep.full_name}
          </h2>
          <p className="text-sm text-ink-500 mt-0.5">{rep.email} · {rep.position || rep.team || ''}</p>
        </div>
      </div>

      {/* Date + progress */}
      <div className="bg-white rounded-2xl border border-ink-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
            Data do acompanhamento
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block px-3 py-2 border border-ink-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ink-500 font-medium">Critérios preenchidos</span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {filled}/{totalCriteria}
            </span>
          </div>
          <div className="h-2 bg-paper-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.15em] text-ink-500 font-semibold">
            Legenda:
          </span>
          {SCORE_OPTS.map((v) => (
            <span key={v} className="flex items-center gap-1 text-xs font-semibold">
              <span
                className={`h-6 w-6 rounded-md flex items-center justify-center text-white text-xs font-bold ${
                  v === 'N' ? 'bg-rose-500' : v === 'A' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              >
                {v}
              </span>
              {SCORE_LABEL[v]}
            </span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {config.map((section) => (
        <div key={section.section} className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="px-5 py-3 bg-ink-900 flex items-center gap-3">
            <span className="h-7 w-7 rounded-full bg-gold-400 flex items-center justify-center font-display text-sm font-bold text-ink-900">
              {section.section}
            </span>
            <h3 className="font-semibold text-white">{section.label}</h3>
          </div>

          {section.subsections.map((sub) => {
            const subFilled = sub.criteria.filter((c) => scores[c.key]).length;
            return (
              <div key={sub.key} className="border-b border-ink-100 last:border-none">
                <div className="px-5 py-2.5 bg-ink-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gold-700 mr-2">{sub.key}</span>
                    <span className="text-sm font-semibold text-ink-800">{sub.label}</span>
                  </div>
                  <span className="text-[11px] text-ink-400 tabular-nums">
                    {subFilled}/{sub.criteria.length}
                  </span>
                </div>
                <div className="px-5">
                  {sub.criteria.map((crit) => (
                    <CriteriaRow
                      key={crit.key}
                      crit={crit}
                      score={scores[crit.key]}
                      onChange={(v) => setScore(crit.key, v)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Combinados */}
      <div className="bg-white rounded-2xl border border-ink-100 p-5">
        <label className="block text-sm font-semibold text-ink-800 mb-2">
          Combinados — Anotações do acompanhamento
        </label>
        <textarea
          rows={4}
          placeholder={`Ex: ${new Date().toLocaleDateString('pt-BR')} — Combinamos trabalhar melhor o pré-visita, com foco no histórico do médico...`}
          value={combinados}
          onChange={(e) => setCombinados(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 outline-none text-ink-800 placeholder:text-ink-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pb-8">
        <button
          onClick={onCancel}
          className="text-sm text-ink-500 hover:text-ink-800"
        >
          Cancelar
        </button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="border-ink-200"
          >
            Salvar rascunho
          </Button>
          <Button
            onClick={() => handleSave('completed')}
            disabled={saving || filled < totalCriteria}
            className="bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold gap-2 shadow-gold"
          >
            <CheckCircle2 className="w-4 h-4" />
            {saving ? 'Salvando…' : 'Concluir avaliação'}
          </Button>
        </div>
      </div>
    </div>
  );
}
