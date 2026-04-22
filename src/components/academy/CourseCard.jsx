import React from 'react';
import { PlayCircle, Clock, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function CourseCard({ course, lessonCount }) {
  const isEnrolled = course.progress !== undefined;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.cover_image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute top-3 left-3">
             <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">
                {course.category || 'General'}
             </Badge>
          </div>
          {course.module_type && (
             <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-none">
                  {course.module_type.charAt(0).toUpperCase() + course.module_type.slice(1)}
                </Badge>
             </div>
          )}
        </div>
        
        <CardHeader className="p-5 pb-2">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
             <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration_minutes || 60}m</span>
             <span>•</span>
             <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {lessonCount || course.lessons_count || 0} Aulas</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-2 flex-1">
          <p className="text-slate-600 text-sm line-clamp-2">{course.description}</p>
          
          <div className="flex items-center gap-1 mt-3">
             {[1,2,3,4,5].map(star => (
                <Star key={star} className={`w-3 h-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
             ))}
             <span className="text-xs text-slate-400 ml-1">(4.0)</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 mt-auto">
          <Button 
            className="w-full bg-slate-900 hover:bg-indigo-600 transition-colors group-hover:shadow-lg shadow-slate-200"
            onClick={() => window.location.href = createPageUrl(`Course?id=${course.id}`)}
          >
            {isEnrolled ? (
              <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Continuar</span>
            ) : (
              <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Começar</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}