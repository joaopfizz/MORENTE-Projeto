import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Video, FileText, HelpCircle, BookOpen, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LESSON_TYPES = [
  { value: 'video', label: 'Vídeo', icon: Video },
  { value: 'text', label: 'Texto/Estudo de Caso', icon: FileText },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'scorm', label: 'Material (SCORM/PDF)', icon: BookOpen },
];

const EMPTY_COURSE = { title: '', description: '', module_type: 'academy', instructor: '', duration_minutes: 0, category: '', is_published: false, cover_image: '' };
const EMPTY_LESSON = { title: '', type: 'video', description: '', content_url: '', content_text: '', duration_minutes: 0, order: 1 };

export default function AcademyTab({ companies }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseOpen, setCourseOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [cs, ls] = await Promise.all([base44.entities.Course.list(), base44.entities.Lesson.list()]);
    setCourses(cs);
    setLessons(ls);
  };

  const courseLessons = (courseId) => lessons.filter(l => l.course_id === courseId).sort((a, b) => a.order - b.order);

  const openNewCourse = () => { setEditingCourse(null); setCourseForm(EMPTY_COURSE); setCourseOpen(true); };
  const openEditCourse = (c) => { setEditingCourse(c); setCourseForm(c); setCourseOpen(true); };
  const saveCourse = async () => {
    if (editingCourse) await base44.entities.Course.update(editingCourse.id, courseForm);
    else await base44.entities.Course.create(courseForm);
    setCourseOpen(false); load();
  };
  const removeCourse = async (id) => { if (!confirm('Remover curso e todas as lições?')) return; await base44.entities.Course.delete(id); load(); };

  const openNewLesson = (courseId) => { setActiveCourseId(courseId); setEditingLesson(null); setLessonForm({ ...EMPTY_LESSON, order: courseLessons(courseId).length + 1 }); setLessonOpen(true); };
  const openEditLesson = (l) => { setActiveCourseId(l.course_id); setEditingLesson(l); setLessonForm(l); setLessonOpen(true); };
  const saveLesson = async () => {
    const payload = { ...lessonForm, course_id: activeCourseId };
    if (editingLesson) await base44.entities.Lesson.update(editingLesson.id, payload);
    else await base44.entities.Lesson.create(payload);
    setLessonOpen(false); load();
  };
  const removeLesson = async (id) => { if (!confirm('Remover lição?')) return; await base44.entities.Lesson.delete(id); load(); };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setLessonForm(f => ({ ...f, content_url: file_url }));
    setUploading(false);
    fileRef.current.value = '';
  };

  const CF = (k, v) => setCourseForm(f => ({ ...f, [k]: v }));
  const LF = (k, v) => setLessonForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={openNewCourse}>
          <Plus className="w-4 h-4" /> Novo Curso
        </Button>
      </div>

      <div className="space-y-3">
        {courses.map(course => {
          const cls = courseLessons(course.id);
          const isExpanded = expandedCourse === course.id;
          return (
            <Card key={course.id} className="border border-slate-200">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {course.cover_image && <img src={course.cover_image} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                    <div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{course.module_type}</Badge>
                        <Badge variant="secondary">{cls.length} lições</Badge>
                        {course.is_published ? <Badge className="bg-emerald-100 text-emerald-700">Publicado</Badge> : <Badge variant="secondary">Rascunho</Badge>}
                        {course.category && <Badge variant="outline">{course.category}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); openEditCourse(course); }}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); removeCourse(course.id); }}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 self-center" /> : <ChevronDown className="w-5 h-5 text-slate-400 self-center" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Lições do Curso</h4>
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => openNewLesson(course.id)}>
                        <Plus className="w-3 h-3" /> Adicionar Lição
                      </Button>
                    </div>
                    {cls.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Nenhuma lição. Clique em "Adicionar Lição".</p>}
                    {cls.map(lesson => {
                      const TypeIcon = LESSON_TYPES.find(t => t.value === lesson.type)?.icon || FileText;
                      return (
                        <div key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <span className="text-xs text-slate-400 w-6 text-center">{lesson.order}</span>
                          <TypeIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                          <span className="text-xs text-slate-400">{lesson.duration_minutes}min</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditLesson(lesson)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLesson(lesson.id)}><Trash2 className="w-3 h-3 text-red-400" /></Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
        {courses.length === 0 && <div className="text-center py-16 text-slate-400">Nenhum curso criado ainda.</div>}
      </div>

      {/* Course Dialog */}
      <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><Label>Título *</Label><Input value={courseForm.title} onChange={e => CF('title', e.target.value)} /></div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={courseForm.description} onChange={e => CF('description', e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Módulo</Label>
                <Select value={courseForm.module_type} onValueChange={v => CF('module_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academy">Academy</SelectItem>
                    <SelectItem value="lidherar">Lidherar</SelectItem>
                    <SelectItem value="scanner">Scanner</SelectItem>
                    <SelectItem value="athivar">Athivar</SelectItem>
                    <SelectItem value="evoluthion">Evoluthion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={courseForm.is_published ? 'published' : 'draft'} onValueChange={v => CF('is_published', v === 'published')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Instrutor</Label><Input value={courseForm.instructor} onChange={e => CF('instructor', e.target.value)} /></div>
              <div className="space-y-1"><Label>Categoria</Label><Input value={courseForm.category} onChange={e => CF('category', e.target.value)} /></div>
              <div className="space-y-1"><Label>Duração (min)</Label><Input type="number" value={courseForm.duration_minutes} onChange={e => CF('duration_minutes', Number(e.target.value))} /></div>
            </div>
            <div className="space-y-1"><Label>URL da Capa (imagem)</Label><Input placeholder="https://..." value={courseForm.cover_image} onChange={e => CF('cover_image', e.target.value)} /></div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={saveCourse}>Salvar Curso</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingLesson ? 'Editar Lição' : 'Nova Lição'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2"><Label>Título *</Label><Input value={lessonForm.title} onChange={e => LF('title', e.target.value)} /></div>
              <div className="space-y-1">
                <Label>Tipo de Conteúdo</Label>
                <Select value={lessonForm.type} onValueChange={v => LF('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    <SelectItem value="live">Aula ao Vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Ordem</Label><Input type="number" value={lessonForm.order} onChange={e => LF('order', Number(e.target.value))} /></div>
              <div className="space-y-1"><Label>Duração (min)</Label><Input type="number" value={lessonForm.duration_minutes} onChange={e => LF('duration_minutes', Number(e.target.value))} /></div>
            </div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={lessonForm.description} onChange={e => LF('description', e.target.value)} rows={2} /></div>

            {(lessonForm.type === 'video' || lessonForm.type === 'scorm') && (
              <div className="space-y-2">
                <Label>URL do Conteúdo (vídeo/embed)</Label>
                <Input placeholder="https://www.youtube.com/embed/..." value={lessonForm.content_url} onChange={e => LF('content_url', e.target.value)} />
                <div className="flex items-center gap-2">
                  <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current.click()} disabled={uploading}>
                    <Upload className="w-4 h-4" /> {uploading ? 'Enviando...' : 'Upload de arquivo'}
                  </Button>
                  {lessonForm.content_url && <span className="text-xs text-emerald-600 font-medium">✓ Arquivo carregado</span>}
                </div>
              </div>
            )}

            {(lessonForm.type === 'text' || lessonForm.type === 'quiz') && (
              <div className="space-y-1">
                <Label>{lessonForm.type === 'quiz' ? 'Conteúdo JSON do Quiz' : 'Conteúdo (Markdown)'}</Label>
                <Textarea
                  placeholder={lessonForm.type === 'quiz'
                    ? `[{"id":"q1","text":"Pergunta?","type":"single_choice","options":["A","B","C"],"correct_answer":"A"}]`
                    : '## Título\n\nConteúdo em **Markdown** aqui...'
                  }
                  value={lessonForm.content_text}
                  onChange={e => LF('content_text', e.target.value)}
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>
            )}

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={saveLesson}>Salvar Lição</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}