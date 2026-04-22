import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, Trophy, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EMPTY_FORM = {
  title: '', description: '', objective: '', instructions: '', success_criteria: '',
  points_reward: 100, deadline: '', target_audience: '', challenge_type: 'team',
  status: 'draft', cover_image: '', evidence_required: true, max_participants: 0
};

const STATUS_COLOR = { draft: 'bg-slate-100 text-slate-600', active: 'bg-emerald-100 text-emerald-700', completed: 'bg-blue-100 text-blue-700', archived: 'bg-red-100 text-red-600' };
const TYPE_LABELS = { team: 'Time', individual: 'Individual', department: 'Departamento', company_wide: 'Empresa toda' };

export default function AthivarTab({ companies }) {
  const [challenges, setChallenges] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { load(); }, []);
  const load = async () => { const data = await base44.entities.Challenge.list(); setChallenges(data); };

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setOpen(true); };
  const save = async () => {
    if (editing) await base44.entities.Challenge.update(editing.id, form);
    else await base44.entities.Challenge.create(form);
    setOpen(false); load();
  };
  const remove = async (id) => { if (!confirm('Remover desafio?')) return; await base44.entities.Challenge.delete(id); load(); };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-orange-600 hover:bg-orange-700 gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Desafio Coletivo
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map(c => (
          <Card key={c.id} className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-orange-500 shrink-0" />
                    <CardTitle className="text-base">{c.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                <Badge className={STATUS_COLOR[c.status]}>{c.status}</Badge>
                <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{TYPE_LABELS[c.challenge_type]}</Badge>
                <Badge variant="secondary"><Trophy className="w-3 h-3 mr-1" />{c.points_reward} pts</Badge>
                {c.deadline && <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />{c.deadline}</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
        {challenges.length === 0 && <div className="col-span-2 text-center py-16 text-slate-400">Nenhum desafio criado ainda.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Editar Desafio' : 'Novo Desafio Coletivo'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><Label>Título *</Label><Input value={form.title} onChange={e => F('title', e.target.value)} /></div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={form.description} onChange={e => F('description', e.target.value)} rows={2} /></div>
            <div className="space-y-1"><Label>Objetivo Principal</Label><Textarea value={form.objective} onChange={e => F('objective', e.target.value)} rows={2} /></div>
            <div className="space-y-1"><Label>Instruções / Como Participar</Label><Textarea value={form.instructions} onChange={e => F('instructions', e.target.value)} rows={3} /></div>
            <div className="space-y-1"><Label>Critérios de Sucesso</Label><Textarea value={form.success_criteria} onChange={e => F('success_criteria', e.target.value)} rows={2} /></div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tipo de Desafio</Label>
                <Select value={form.challenge_type} onValueChange={v => F('challenge_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Time</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="department">Departamento</SelectItem>
                    <SelectItem value="company_wide">Empresa toda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => F('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Pontos de Recompensa</Label><Input type="number" value={form.points_reward} onChange={e => F('points_reward', Number(e.target.value))} /></div>
              <div className="space-y-1"><Label>Prazo</Label><Input type="date" value={form.deadline} onChange={e => F('deadline', e.target.value)} /></div>
              <div className="space-y-1"><Label>Público-alvo</Label><Input placeholder="Ex: Time de Vendas, SP" value={form.target_audience} onChange={e => F('target_audience', e.target.value)} /></div>
              <div className="space-y-1"><Label>Máx. Participantes (0 = ilimitado)</Label><Input type="number" value={form.max_participants} onChange={e => F('max_participants', Number(e.target.value))} /></div>
            </div>

            <div className="space-y-1"><Label>URL da Imagem de Capa</Label><Input placeholder="https://..." value={form.cover_image} onChange={e => F('cover_image', e.target.value)} /></div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="evidence" checked={form.evidence_required} onChange={e => F('evidence_required', e.target.checked)} className="rounded" />
              <Label htmlFor="evidence">Exigir envio de evidência/comprovação</Label>
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={save}>Salvar Desafio</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}