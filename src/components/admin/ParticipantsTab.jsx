import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Upload, Search, Users, Edit, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const STATUS_ICONS = {
  active: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  inactive: <XCircle className="w-4 h-4 text-red-400" />,
  pending: <Clock className="w-4 h-4 text-amber-400" />
};

const LEVELS = ['c_level','diretor','gerente','coordenador','supervisor','especialista','analista','assistente','operacional'];
const CONTRACTS = ['clt','pj','estagiario','terceirizado'];

const EMPTY_FORM = {
  full_name: '', email: '', position: '', department: '', team: '',
  business_unit: '', location: '', cost_center: '', manager_email: '',
  hierarchy_level: '', contract_type: 'clt', phone: '', hire_date: '',
  custom_field_1: '', custom_field_2: '', status: 'pending', tags: []
};

export default function ParticipantsTab({ companies }) {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.Participant.list();
    setParticipants(data);
  };

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm(p); setOpen(true); };

  const save = async () => {
    if (editing) await base44.entities.Participant.update(editing.id, form);
    else await base44.entities.Participant.create(form);
    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Remover participante?')) return;
    await base44.entities.Participant.delete(id);
    load();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: "object",
        properties: {
          participants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                full_name: { type: "string" }, email: { type: "string" },
                position: { type: "string" }, department: { type: "string" },
                team: { type: "string" }, business_unit: { type: "string" },
                hierarchy_level: { type: "string" }, contract_type: { type: "string" },
                manager_email: { type: "string" }, location: { type: "string" }
              }
            }
          }
        }
      }
    });
    if (result.status === 'success' && result.output?.participants) {
      const rows = result.output.participants;
      const companyId = filterCompany !== 'all' ? filterCompany : (companies[0]?.id || '');
      await base44.entities.Participant.bulkCreate(rows.map(r => ({ ...r, company_id: companyId, status: 'pending' })));
      setImportResult({ success: true, count: rows.length });
      load();
    } else {
      setImportResult({ success: false });
    }
    setImporting(false);
    fileRef.current.value = '';
  };

  const F = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const filtered = participants.filter(p =>
    (filterCompany === 'all' || p.company_id === filterCompany) &&
    (p.full_name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar participante..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Empresa" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImport} />
          <Button variant="outline" className="gap-2" onClick={() => fileRef.current.click()} disabled={importing}>
            <Upload className="w-4 h-4" /> {importing ? 'Importando...' : 'Importar CSV/Excel'}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={openNew}>
            <Plus className="w-4 h-4" /> Novo Participante
          </Button>
        </div>
      </div>

      {importResult && (
        <div className={`p-3 rounded-lg text-sm font-medium ${importResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {importResult.success ? `✅ ${importResult.count} participantes importados com sucesso!` : '❌ Erro ao processar arquivo. Verifique o formato.'}
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Área/Time</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-slate-400 py-10">Nenhum participante encontrado</TableCell></TableRow>
            )}
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name}</TableCell>
                <TableCell className="text-slate-500">{p.email}</TableCell>
                <TableCell>{p.position || '-'}</TableCell>
                <TableCell><span className="text-xs">{p.department}{p.team ? ` / ${p.team}` : ''}</span></TableCell>
                <TableCell>{p.hierarchy_level ? <Badge variant="secondary">{p.hierarchy_level}</Badge> : '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {STATUS_ICONS[p.status]}
                    <span className="text-xs capitalize">{p.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Participante' : 'Novo Participante'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Nome Completo *</Label>
              <Input value={form.full_name} onChange={e => F('full_name', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>E-mail *</Label>
              <Input type="email" value={form.email} onChange={e => F('email', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => F('phone', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Empresa</Label>
              <Select value={form.company_id || ''} onValueChange={v => F('company_id', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Cargo/Função</Label>
              <Input value={form.position} onChange={e => F('position', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Departamento/Área</Label>
              <Input value={form.department} onChange={e => F('department', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Time/Grupo</Label>
              <Input value={form.team} onChange={e => F('team', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Unidade de Negócio</Label>
              <Input value={form.business_unit} onChange={e => F('business_unit', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Localidade/Filial</Label>
              <Input value={form.location} onChange={e => F('location', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Centro de Custo</Label>
              <Input value={form.cost_center} onChange={e => F('cost_center', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>E-mail do Gestor</Label>
              <Input value={form.manager_email} onChange={e => F('manager_email', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Nível Hierárquico</Label>
              <Select value={form.hierarchy_level || ''} onValueChange={v => F('hierarchy_level', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => <SelectItem key={l} value={l}>{l.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Tipo de Contrato</Label>
              <Select value={form.contract_type || 'clt'} onValueChange={v => F('contract_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTRACTS.map(c => <SelectItem key={c} value={c}>{c.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Data de Admissão</Label>
              <Input type="date" value={form.hire_date} onChange={e => F('hire_date', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status || 'pending'} onValueChange={v => F('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Campo Extra 1</Label>
              <Input placeholder="Customizado" value={form.custom_field_1} onChange={e => F('custom_field_1', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Campo Extra 2</Label>
              <Input placeholder="Customizado" value={form.custom_field_2} onChange={e => F('custom_field_2', e.target.value)} />
            </div>
          </div>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" onClick={save}>Salvar Participante</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}