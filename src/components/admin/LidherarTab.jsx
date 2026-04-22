import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EMPTY_GOAL = { id: '', description: '', how: '', deadline: '' };
const EMPTY_FORM = { title: '', description: '', competencies: [], goals: [], target_role: '', target_level: '', due_date: '', is_template: false, status: 'draft' };

export default function LidherarTab({ companies }) {
  const [agreements, setAgreements] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedGoals, setExpandedGoals] = useState(true);
  const [competencyInput, setCompetencyInput] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [agrs, asss] = await Promise.all([
      base44.entities.DevelopmentAgreement.list(),
      base44.entities.Assessment.filter({ module_type: 'scanner' })
    ]);
    setAgreements(agrs);
    setAssessments(asss);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (a) => { setEditing(a); setForm({ ...a, goals: a.goals || [], competencies: a.competencies || [] }); setOpen(true); };

  const save = async () => {
    if (editing) await base44.entities.DevelopmentAgreement.update(editing.id, form);
    else await base44.entities.DevelopmentAgreement.create(form);
    setOpen(false); load();
  };

  const remove = async (id) => { if (!confirm('Remover acordo?')) return; await base44.entities.DevelopmentAgreement.delete(id); load(); };

  const addGoal = () => setForm(f => ({ ...f, goals: [...f.goals, { ...EMPTY_GOAL, id: `g${Date.now()}` }] }));
  const updateGoal = (idx, key, value) => setForm(f => { const gs = [...f.goals]; gs[idx] = { ...gs[idx], [key]: value }; return { ...f, goals: gs }; });
  const removeGoal = (idx) => setForm(f => ({ ...f, goals: f.goals.filter((_, i) => i !== idx) }));

  const addCompetency = () => {
    if (!competencyInput.trim()) return;
    setForm(f => ({ ...f, competencies: [...f.competencies, competencyInput.trim()] }));
    setCompetencyInput('');
  };
  const removeCompetency = (idx) => setForm(f => ({ ...f, competencies: f.competencies.filter((_, i) => i !== idx) }));

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Acordo de Desenvolvimento
        </Button>
      </div>

      <div className="grid gap-4">
        {agreements.map(a => (
          <Card key={a.id} className="border border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{a.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {a.is_template && <Badge className="bg-blue-100 text-blue-700">Modelo</Badge>}
                    <Badge variant="secondary">{a.goals?.length || 0} metas</Badge>
                    {a.target_role && <Badge variant="outline">{a.target_role}</Badge>}
                    {a.competencies?.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    <Badge className={a.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{a.status}</Badge>
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
        {agreements.length === 0 && <div className="text-center py-16 text-slate-400">Nenhum acordo criado ainda.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Editar Acordo' : 'Novo Acordo de Desenvolvimento'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1"><Label>Título *</Label><Input value={form.title} onChange={e => F('title', e.target.value)} /></div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={form.description} onChange={e => F('description', e.target.value)} rows={2} /></div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Cargo Alvo</Label><Input value={form.target_role} onChange={e => F('target_role', e.target.value)} /></div>
              <div className="space-y-1"><Label>Nível Alvo</Label><Input value={form.target_level} onChange={e => F('target_level', e.target.value)} /></div>
              <div className="space-y-1"><Label>Prazo</Label><Input type="date" value={form.due_date} onChange={e => F('due_date', e.target.value)} /></div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => F('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="template" checked={form.is_template} onChange={e => F('is_template', e.target.checked)} className="rounded" />
              <Label htmlFor="template">Salvar como modelo reutilizável</Label>
            </div>

            {/* Competências */}
            <div className="space-y-2 border rounded-xl p-4">
              <h4 className="font-semibold text-sm text-slate-700">Competências/Fatores do Scanner</h4>
              <div className="flex gap-2">
                <Input placeholder="Ex: Comunicação, Liderança..." value={competencyInput} onChange={e => setCompetencyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCompetency()} />
                <Button size="sm" variant="outline" onClick={addCompetency}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {form.competencies.map((c, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeCompetency(i)}>
                    {c} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Metas */}
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer" onClick={() => setExpandedGoals(!expandedGoals)}>
                <h4 className="font-semibold text-sm text-slate-700">Metas de Desenvolvimento ({form.goals.length})</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={e => { e.stopPropagation(); addGoal(); }}>
                    <Plus className="w-3 h-3" /> Adicionar Meta
                  </Button>
                  {expandedGoals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              {expandedGoals && (
                <div className="p-4 space-y-4">
                  {form.goals.map((g, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600">Meta {idx + 1}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeGoal(idx)}><Trash2 className="w-3 h-3 text-red-400" /></Button>
                      </div>
                      <Textarea placeholder="Descrição da meta..." value={g.description} onChange={e => updateGoal(idx, 'description', e.target.value)} rows={2} />
                      <Input placeholder="Como será feito?" value={g.how} onChange={e => updateGoal(idx, 'how', e.target.value)} />
                      <Input type="date" value={g.deadline} onChange={e => updateGoal(idx, 'deadline', e.target.value)} />
                    </div>
                  ))}
                  {form.goals.length === 0 && <p className="text-sm text-slate-400 text-center py-2">Nenhuma meta adicionada.</p>}
                </div>
              )}
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={save}>Salvar Acordo</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}