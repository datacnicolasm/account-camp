import { z } from "zod";

const quizQuestionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const quizQuestionDataSchema = z
  .object({
    topicTitle: z.string().min(1).optional(),
    context: z.string().min(1).optional(),
    questionText: z.string().min(1),
    options: z.array(quizQuestionOptionSchema).min(2),
    correctOptionId: z.string().min(1),
  })
  .refine(
    (data) => data.options.some((option) => option.id === data.correctOptionId),
    { message: "correctOptionId must match one of the option ids" }
  );

export type QuizQuestionOption = z.infer<typeof quizQuestionOptionSchema>;
export type QuizQuestionData = z.infer<typeof quizQuestionDataSchema>;

/** Enriched quiz JSONB shape: topicTitle, context, questionText, options, correctOptionId */
export interface EnrichedQuizQuestionData extends QuizQuestionData {
  topicTitle: string;
  context: string;
}

export function hasQuizTopicTitle(
  questionData: QuizQuestionData
): questionData is QuizQuestionData & { topicTitle: string } {
  return Boolean(questionData.topicTitle?.trim());
}

export function hasQuizContext(
  questionData: QuizQuestionData
): questionData is QuizQuestionData & { context: string } {
  return Boolean(questionData.context?.trim());
}

export function isEnrichedQuizQuestion(
  questionData: QuizQuestionData
): questionData is EnrichedQuizQuestionData {
  return hasQuizTopicTitle(questionData) && hasQuizContext(questionData);
}

export function parseQuizQuestionData(raw: unknown): QuizQuestionData | null {
  const result = quizQuestionDataSchema.safeParse(raw);
  return result.success ? result.data : null;
}
