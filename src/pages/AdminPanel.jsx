import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Building2, Save, Edit, Users, ClipboardList, BookOpen, Target, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParticipantsTab from '../components/admin/ParticipantsTab';
import ScannerTab from '../components/admin/ScannerTab';
import AcademyTab from '../components/admin/AcademyTab';
import LidherarTab from '../components/admin/LidherarTab';
import AthivarTab from '../components/admin/AthivarTab';

export default function AdminPanel() {
  const [companies, setCompanies] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logo_url: '', primary_color: '#0f172a', secondary_color: '#4f46e5' });

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    const comps = await base44.entities.Company.list();
    setCompanies(comps);
  };

  const handleSaveCompany = async () => {
    if (editingCompany) await base44.entities.Company.update(editingCompany.id, formData);
    else await base44.entities.Company.create(formData);
    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', slug: '', logo_url: '', primary_color: '#0f172a', secondary_color: '#4f46e5' });
    fetchCompanies();
  };

  const handleEditClick = (company) => { setEditingCompany(company); setFormData(company); setIsDialogOpen(true); };

  const TABS = [
    { value: 'participants', label: 'Participantes', icon: Users },
    { value: 'scanner', label: 'Scanner', icon: ClipboardList },
    { value: 'academy', label: 'Academy', icon: BookOpen },
    { value: 'lidherar', label: 'Lidherar', icon: Target },
    { value: 'athivar', label: 'Athivar', icon: Trophy },
    { value: 'companies', label: 'Empresas', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-600" />
            Painel Administrativo
          </h1>
          <p className="text-slate-500 mt-1">Gerencie participantes, conteúdos, questionários e desafios da plataforma.</p>
        </div>
      </div>

      <Tabs defaultValue="participants">
        <TabsList className="bg-white border border-slate-200 flex-wrap h-auto gap-1 p-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Icon className="w-4 h-4" /> {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="participants" className="mt-6">
          <ParticipantsTab companies={companies} />
        </TabsContent>

        <TabsContent value="scanner" className="mt-6">
          <ScannerTab />
        </TabsContent>

        <TabsContent value="academy" className="mt-6">
          <AcademyTab companies={companies} />
        </TabsContent>

        <TabsContent value="lidherar" className="mt-6">
          <LidherarTab companies={companies} />
        </TabsContent>

        <TabsContent value="athivar" className="mt-6">
          <AthivarTab companies={companies} />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                onClick={() => { setEditingCompany(null); setFormData({ name: '', slug: '', logo_url: '', primary_color: '#0f172a', secondary_color: '#4f46e5' }); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4" /> Nova Empresa
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map(company => (
                <Card key={company.id} className="border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditClick(company)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {company.logo_url
                        ? <img src={company.logo_url} className="w-10 h-10 rounded-lg object-contain bg-slate-100 p-1 border" alt="" />
                        : <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"><Building2 className="w-5 h-5 text-indigo-600" /></div>
                      }
                      <div>
                        <CardTitle className="text-base">{company.name}</CardTitle>
                        <p className="text-xs text-slate-400">{company.slug}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: company.primary_color }} title="Cor primária" />
                      <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: company.secondary_color }} title="Cor secundária" />
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${company.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {company.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCompany ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nome da Empresa</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2"><Label>Slug (URL)</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="space-y-2"><Label>Logo URL</Label>
              <Input value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Cor Primária</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{ backgroundColor: formData.primary_color }}></div>
                  <Input value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2"><Label>Cor Secundária</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{ backgroundColor: formData.secondary_color }}></div>
                  <Input value={formData.secondary_color} onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} />
                </div>
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveCompany}>
              <Save className="w-4 h-4 mr-2" /> Salvar Empresa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}