import type { QuizQuestionData } from "./quiz-lesson.schema";
import type {
  AccountingDocumentMetadata,
  AccountingDocumentType,
} from "./accounting-exercise.schema";

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

export interface AccountingAccountOption {
  code: string;
  name: string;
}

export interface AccountingExerciseDocument {
  id: string;
  documentType: AccountingDocumentType;
  metadata: AccountingDocumentMetadata;
}

export interface LessonViewerAccountingExercise {
  title: string;
  context: string;
  instructions: string[];
  allowedAccountCodes: string[];
  accounts: AccountingAccountOption[];
  documents: AccountingExerciseDocument[];
}

export interface LessonViewerData {
  lesson: LessonViewerLesson;
  typeKey: string;
  video: LessonViewerVideo | null;
  quiz: LessonViewerQuiz | null;
  accountingExercise: LessonViewerAccountingExercise | null;
  context: LessonViewerContext | null;
  nextLessonHref: string | null;
}
