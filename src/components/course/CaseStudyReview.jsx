import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Loader2, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaseStudyReview({ lesson, type = 'case_study' }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isCase = type === 'case_study';

  const handleSubmit = async () => {
    if (!comment.trim() || comment.trim().length < 30) return;
    setLoading(true);
    setFeedback(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um tutor especialista em desenvolvimento de liderança e educação corporativa. Seu papel é ser acolhedor e humano — mas firme, criterioso e honesto. Nunca dê elogios vazios. Toda orientação deve ser fundamentada no que o aluno escreveu.

O aluno acabou de ler o seguinte ${isCase ? 'estudo de caso' : 'texto'}:
---
TÍTULO: ${lesson.title}
CONTEÚDO: ${lesson.content_text?.substring(0, 2000)}
---

Reflexão enviada pelo aluno:
"${comment}"

Analise com profundidade e critério, considerando:
1. O aluno compreendeu realmente os conceitos centrais do ${isCase ? 'caso' : 'texto'} — ou apenas parafraseous o que leu sem elaborar?
2. Conectou com sua realidade profissional de forma concreta e específica, ou ficou no genérico?
3. Demonstrou pensamento crítico, questionamento próprio ou insight genuíno?
4. A reflexão tem profundidade real ou é superficial e vaga?

REGRAS PARA SUA ANÁLISE:
- Se a resposta for superficial ou repetitiva, diga isso com gentileza mas com clareza e objetividade.
- Se houver crença limitante, equívoco conceitual ou desvio de interpretação, aponte-o diretamente.
- Se houver pontos genuinamente bons, reconheça-os citando o que o aluno escreveu.
- Seja específico: referencie trechos ou ideias concretas da reflexão do aluno.
- Use linguagem respeitosa, próxima e profissional. Em português.

Responda em JSON com:
- "aprovado": true se a reflexão demonstra compreensão genuína e profundidade suficiente (nota >= 7), false caso contrário
- "nota": número de 0 a 10
- "titulo": título curto e motivador do feedback (máx 8 palavras)
- "feedback": parágrafo de 4-6 frases com análise detalhada. Cite trechos ou ideias do que o aluno escreveu para fundamentar sua análise. Aponte forças reais e lacunas reais. Se ficou superficial, diga diretamente com gentileza.
- "dica": orientação ALTAMENTE ESPECÍFICA baseada exatamente no que o aluno escreveu. Não dê dicas genéricas. Identifique um dos seguintes — e seja direto sobre qual se aplica: (a) uma crença limitante ou equivocada presente na reflexão — e qual é ela e por que precisa ser revista; (b) uma lacuna de conhecimento técnico ou conceitual — e sobre o quê exatamente; (c) um desvio de interpretação — e qual seria a leitura correta do ${isCase ? 'caso' : 'texto'}; ou (d) um ponto forte que pode ser aprofundado — e como especificamente. Comece sempre referenciando algo concreto que o aluno escreveu. Em português. Máximo 3 frases.`,
      response_json_schema: {
        type: "object",
        properties: {
          aprovado: { type: "boolean" },
          nota: { type: "number" },
          titulo: { type: "string" },
          feedback: { type: "string" },
          dica: { type: "string" }
        }
      }
    });

    setFeedback(result);
    setLoading(false);
  };

  const isGood = feedback?.aprovado;

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 pb-10">
      <div className="border-t-2 border-dashed border-indigo-200 pt-8 mt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              {isCase ? 'Sua Reflexão sobre o Estudo de Caso' : 'Sua Reflexão sobre o Texto'}
            </h3>
            <p className="text-sm text-slate-500">Compartilhe o que aprendeu e como aplicaria na sua realidade profissional.</p>
          </div>
        </div>

        <Textarea
          placeholder={isCase
            ? 'Descreva o que compreendeu do estudo de caso, quais insights você tirou e como aplicaria essas lições no seu contexto profissional... (mínimo 30 caracteres)'
            : 'Descreva o que compreendeu do texto, quais ideias te marcaram e como você conecta isso com sua realidade profissional... (mínimo 30 caracteres)'
          }
          className="min-h-[140px] text-sm resize-none border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={loading || !!feedback}
        />

        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${comment.length < 30 ? 'text-slate-400' : 'text-emerald-600 font-medium'}`}>
            {comment.length} caracteres {comment.length < 30 ? `(mínimo 30)` : '✓'}
          </span>
          {!feedback && (
            <Button
              onClick={handleSubmit}
              disabled={loading || comment.trim().length < 30}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analisando com IA...</>
              ) : (
                <><Send className="w-4 h-4" /> Enviar para Análise</>
              )}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 rounded-2xl p-6 border-2 ${
                isGood
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${isGood ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  {isGood
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    : <AlertCircle className="w-6 h-6 text-amber-600" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className={`font-bold text-lg ${isGood ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {feedback.titulo}
                    </h4>
                    <span className={`text-2xl font-bold ${isGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {feedback.nota}/10
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isGood ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {feedback.feedback}
                  </p>
                  {feedback.dica && (
                    <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                      isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      💡 <strong>Orientação personalizada:</strong> {feedback.dica}
                    </div>
                  )}
                  {!isGood && (
                    <Button
                      variant="outline"
                      className="mt-4 text-sm border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => { setFeedback(null); }}
                    >
                      Reescrever reflexão
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}