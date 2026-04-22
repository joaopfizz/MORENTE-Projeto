import React from 'react';
import ReactMarkdown from 'react-markdown';
import CaseStudyReview from './CaseStudyReview';

export default function TextLesson({ lesson }) {
  const isCaseStudy = lesson.title?.toLowerCase().includes('estudo de caso');
  const type = isCaseStudy ? 'case_study' : 'reading';

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="prose prose-slate max-w-none
          prose-headings:font-bold prose-headings:text-slate-900
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
          prose-h3:text-lg prose-h3:text-indigo-800 prose-h3:mt-6
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-li:text-slate-700
          prose-strong:text-slate-900
          prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded prose-code:text-indigo-700 prose-code:text-sm
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50 prose-blockquote:rounded-r-lg prose-blockquote:p-4 prose-blockquote:not-italic
          prose-table:border-collapse
          prose-th:bg-slate-100 prose-th:p-2 prose-th:border prose-th:border-slate-300
          prose-td:p-2 prose-td:border prose-td:border-slate-200
        ">
          <ReactMarkdown>{lesson.content_text || ''}</ReactMarkdown>
        </div>
      </div>
      <CaseStudyReview key={lesson.id} lesson={lesson} type={type} />
    </div>
  );
}