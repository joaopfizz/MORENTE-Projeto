import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EMPTY_QUESTION = { id: '', text: '', type: 'single_choice', options: ['', ''] };
const EMPTY_FORM = { title: '', description: '', module_type: 'scanner', is_active: true, questions: [] };

export default function ScannerTab() {
  const [assessments, setAssessments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.Assessment.list();
    setAssessments(data);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (a) => { setEditing(a); setForm({ ...a }); setOpen(true); };

  const save = async () => {
    const payload = { ...form, questions: form.questions.map((q, i) => ({ ...q, id: q.id || `q${i + 1}` })) };
    if (editing) await base44.entities.Assessment.update(editing.id, payload);
    else await base44.entities.Assessment.create(payload);
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Remover questionário?')) return;
    await base44.entities.Assessment.delete(id);
    load();
  };

  const addQuestion = () => {
    const q = { ...EMPTY_QUESTION, id: `q${Date.now()}`, options: ['', ''] };
    setForm(f => ({ ...f, questions: [...f.questions, q] }));
    setExpandedQ(form.questions.length);
  };

  const updateQuestion = (idx, key, value) => {
    setForm(f => {
      const qs = [...f.questions];
      qs[idx] = { ...qs[idx], [key]: value };
      return { ...f, questions: qs };
    });
  };

  const removeQuestion = (idx) => {
    setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));
  };

  const updateOption = (qIdx, oIdx, value) => {
    setForm(f => {
      const qs = [...f.questions];
      const opts = [...qs[qIdx].options];
      opts[oIdx] = value;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...f, questions: qs };
    });
  };

  const addOption = (qIdx) => {
    setForm(f => {
      const qs = [...f.questions];
      qs[qIdx] = { ...qs[qIdx], options: [...qs[qIdx].options, ''] };
      return { ...f, questions: qs };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Questionário
        </Button>
      </div>

      <div className="grid gap-4">
        {assessments.map(a => (
          <Card key={a.id} className="border border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{a.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{a.module_type}</Badge>
                    <Badge variant="secondary">{a.questions?.length || 0} perguntas</Badge>
                    {a.is_active ? <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(a.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {assessments.length === 0 && (
          <div className="text-center py-16 text-slate-400">Nenhum questionário criado ainda.</div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Questionário' : 'Novo Questionário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Título *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Tipo/Módulo</Label>
                <Select value={form.module_type} onValueChange={v => setForm(f => ({ ...f, module_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scanner">Scanner (Diagnóstico)</SelectItem>
                    <SelectItem value="evoluthion">Evoluthion (360°)</SelectItem>
                    <SelectItem value="quiz">Quiz (Academy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.is_active ? 'active' : 'inactive'} onValueChange={v => setForm(f => ({ ...f, is_active: v === 'active' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">Perguntas ({form.questions.length})</h4>
                <Button size="sm" variant="outline" onClick={addQuestion} className="gap-1">
                  <Plus className="w-3 h-3" /> Adicionar Pergunta
                </Button>
              </div>

              <div className="space-y-3">
                {form.questions.map((q, idx) => (
                  <div key={idx} className="border rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer"
                      onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                    >
                      <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}</span>
                      <span className="flex-1 text-sm font-medium truncate">{q.text || 'Pergunta sem título'}</span>
                      <Badge variant="outline" className="text-xs">{q.type}</Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}>
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                      {expandedQ === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>

                    {expandedQ === idx && (
                      <div className="p-4 space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Texto da Pergunta</Label>
                          <Textarea value={q.text} onChange={e => updateQuestion(idx, 'text', e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Tipo de Resposta</Label>
                          <Select value={q.type} onValueChange={v => updateQuestion(idx, 'type', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single_choice">Única escolha</SelectItem>
                              <SelectItem value="multiple_choice">Múltipla escolha</SelectItem>
                              <SelectItem value="scale">Escala (1-10)</SelectItem>
                              <SelectItem value="text">Resposta aberta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                          <div className="space-y-2">
                            <Label className="text-xs">Opções de Resposta</Label>
                            {q.options.map((opt, oIdx) => (
                              <Input key={oIdx} placeholder={`Opção ${oIdx + 1}`} value={opt}
                                onChange={e => updateOption(idx, oIdx, e.target.value)} />
                            ))}
                            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => addOption(idx)}>
                              <Plus className="w-3 h-3" /> Adicionar opção
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={save}>Salvar Questionário</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}