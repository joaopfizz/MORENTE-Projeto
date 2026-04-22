import React from 'react';
import { Target, CheckSquare, MessageSquare, TrendingUp, Shield, Award, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Shared component for the "Journey" modules
export default function JourneyModule({ title, description, type, icon: Icon, colorClass }) {
  
  // Mock data for UI demonstration
  const tasks = [
    { id: 1, title: 'Initial Agreement', status: 'completed', date: '2023-10-01' },
    { id: 2, title: 'Mid-term Review', status: 'pending', date: '2023-11-15' },
    { id: 3, title: 'Final Evidence Submission', status: 'locked', date: '2023-12-01' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 text-white ${colorClass} shadow-2xl`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                 <Icon className="w-8 h-8 text-white" />
               </div>
               <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase tracking-widest">
                  Module
               </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-lg text-white/90 max-w-xl leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[280px] border border-white/10">
            <p className="text-sm font-medium text-white/80 mb-2">Current Progress</p>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold">35%</span>
                <span className="text-sm mb-1 text-white/60">completed</span>
            </div>
            <Progress value={35} className="bg-white/20" indicatorClassName="bg-white" />
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="tasks" className="gap-2"><CheckSquare className="w-4 h-4" /> My Tasks</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><TrendingUp className="w-4 h-4" /> History</TabsTrigger>
          {type === 'lidherar' && <TabsTrigger value="agreements" className="gap-2"><Shield className="w-4 h-4" /> Agreements</TabsTrigger>}
          {type === 'athivar' && <TabsTrigger value="evidence" className="gap-2"><Upload className="w-4 h-4" /> Evidence</TabsTrigger>}
        </TabsList>

        <TabsContent value="tasks" className="grid gap-4">
           {tasks.map((task) => (
             <Card key={task.id} className="border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
               <CardContent className="p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        task.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                      {task.status === 'completed' ? <Award className="w-5 h-5" /> : 
                       task.status === 'pending' ? <Target className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                   </div>
                   <div>
                     <h3 className="font-semibold text-slate-900">{task.title}</h3>
                     <p className="text-sm text-slate-500">Due by {task.date}</p>
                   </div>
                 </div>
                 <Button 
                    variant={task.status === 'completed' ? 'outline' : 'default'}
                    disabled={task.status === 'locked'}
                    className={task.status === 'pending' ? `${colorClass.split(' ')[0]} text-white` : ''}
                 >
                   {task.status === 'completed' ? 'View Details' : 
                    task.status === 'locked' ? 'Locked' : 'Start Task'}
                 </Button>
               </CardContent>
             </Card>
           ))}
        </TabsContent>

        <TabsContent value="agreements">
          <Card className="p-8 text-center bg-slate-50 border-dashed">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Active Agreements</h3>
            <p className="text-slate-500">Schedule a meeting with your leader to initiate a development plan.</p>
            <Button className="mt-4">Schedule Review</Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="evidence">
          <Card className="p-8 text-center bg-slate-50 border-dashed">
            <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Upload Evidence</h3>
            <p className="text-slate-500">Submit photos, documents, or videos proving your challenge completion.</p>
            <Button className="mt-4">Select Files</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}