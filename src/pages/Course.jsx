import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  CheckCircle, 
  ChevronLeft, 
  FileText, 
  HelpCircle, 
  Video,
  Menu,
  ChevronRight
} from 'lucide-react';
import QuizPlayer from '../components/course/QuizPlayer';
import TextLesson from '../components/course/TextLesson';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

export default function Course() {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get ID from URL
  const queryParams = new URLSearchParams(window.location.search);
  const courseId = queryParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        const courseData = await base44.entities.Course.get(courseId);
        setCourse(courseData);

        const lessonsData = await base44.entities.Lesson.filter({ course_id: courseId });
        const sortedLessons = lessonsData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setLessons(sortedLessons);

        if (sortedLessons.length > 0) {
          setCurrentLesson(sortedLessons[0]);
        }
      } catch (error) {
        console.error("Error fetching course data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleMarkComplete = async (lesson) => {
    // advance to next lesson
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx < lessons.length - 1) setCurrentLesson(lessons[idx + 1]);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
  if (!course) return <div className="p-8">Course not found</div>;

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    // In a real app, update 'last_accessed' here
  };

  const LessonIcon = ({ type }) => {
    switch (type) {
        case 'video': return <Video className="w-4 h-4" />;
        case 'quiz': return <HelpCircle className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      {/* Course Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-300 hover:text-white hover:bg-white/10"
                onClick={() => window.location.href = createPageUrl('Academy')}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="font-semibold text-lg line-clamp-1">{course.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Progress value={33} className="w-24 h-1.5 bg-slate-700" />
                    <span>33% Completed</span>
                </div>
            </div>
        </div>
        <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
            {currentLesson ? (
              <div className="h-full flex flex-col">
                {/* Video Player */}
                {currentLesson.type === 'video' && currentLesson.content_url && (
                  <div className="aspect-video bg-black w-full shrink-0">
                    <iframe
                      src={currentLesson.content_url}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={currentLesson.title}
                    />
                  </div>
                )}

                {/* Quiz */}
                {currentLesson.type === 'quiz' && (
                  <QuizPlayer lesson={currentLesson} onComplete={() => handleMarkComplete(currentLesson)} />
                )}

                {/* Text */}
                {currentLesson.type === 'text' && (
                  <TextLesson lesson={currentLesson} />
                )}

                {/* Bottom bar for video/text */}
                {currentLesson.type !== 'quiz' && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between mt-auto">
                    <div>
                      <h2 className="font-bold text-slate-900">{currentLesson.title}</h2>
                      <p className="text-sm text-slate-500">{currentLesson.description}</p>
                    </div>
                    <Button 
                      onClick={() => handleMarkComplete(currentLesson)}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-700 gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Concluir e Avançar
                    </Button>
                  </div>
                )}
              </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Selecione uma aula para começar
                </div>
            )}
        </div>

        {/* Sidebar Lesson List */}
        <div className={`
            absolute md:relative inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-10 transition-transform duration-300 transform
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-80'}
        `}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Course Content</h3>
                    <p className="text-xs text-slate-500 mt-1">{lessons.length} Lessons • {course.duration_minutes || 0}m Total</p>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                        {lessons.map((lesson, idx) => {
                            const isActive = currentLesson?.id === lesson.id;
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonSelect(lesson)}
                                    className={`w-full text-left p-3 rounded-lg flex gap-3 transition-all
                                        ${isActive ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}
                                    `}
                                >
                                    <div className="mt-0.5">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                                            ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-300'}
                                        `}>
                                            {/* Logic for completed would go here */}
                                            <span className="text-[10px] font-bold">{idx + 1}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {lesson.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <LessonIcon type={lesson.type} />
                                                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                                            </span>
                                            <span className="text-xs text-slate-300">•</span>
                                            <span className="text-xs text-slate-400">{lesson.duration_minutes || 10}m</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
      </div>
    </div>
  );
}