import type { QuizQuestionData } from "./quiz-lesson.schema";

export interface LessonViewerLesson {
  id: string;
  name: string;
  xpPoints: number;
  typeSlug: string;
}

export interface LessonViewerVideo {
  bucket: string;
  videoPath: string;
  posterPath: string | null;
  durationSeconds: number | null;
}

export interface LessonViewerContext {
  courseSlug: string;
  courseName: string;
  chapterName: string;
  chapterPosition: number;
}

export interface LessonViewerQuiz {
  title: string;
  description: string | null;
  questionData: QuizQuestionData;
}

export interface LessonViewerData {
  lesson: LessonViewerLesson;
  typeKey: string;
  video: LessonViewerVideo | null;
  quiz: LessonViewerQuiz | null;
  context: LessonViewerContext | null;
  nextLessonHref: string | null;
}
