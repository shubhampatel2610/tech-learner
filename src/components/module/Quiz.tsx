'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '@/types/content.types';
import { useAppDispatch } from '@/store/hooks';
import { recordQuiz } from '@/store/slices/progressSlice';
import { cn } from '@/lib/utils';
import { EMPTY } from '@/lib/appConstants';

interface Props {
  slug: string;
  questions: QuizQuestion[];
}

type Answer = { correct: boolean };

/** Check a single answer against a question of any supported type. */
function grade(q: QuizQuestion, value: string): boolean {
  switch (q.type) {
    case 'mcq':
      return Number(value) === q.answerIndex;
    case 'boolean':
      return (value === 'true') === q.answer;
    case 'fill':
      return value.trim().toLowerCase() === q.answer.trim().toLowerCase();
  }
}

export function Quiz({ slug, questions }: Props) {
  const dispatch = useAppDispatch();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const total = questions.length;
  const correctCount = useMemo(
    () => Object.values(answers).filter((a) => a.correct).length,
    [answers],
  );

  if (!q) return null;

  const submit = () => {
    if (revealed || selected === '') return;
    const isCorrect = grade(q, selected);
    setAnswers((prev) => ({ ...prev, [q.id]: { correct: isCorrect } }));
    setRevealed(true);
  };

  const advance = () => {
    if (idx + 1 >= total) {
      const finalCorrect = Object.values(answers).filter((a) => a.correct).length;
      dispatch(recordQuiz({ slug, score: finalCorrect / total, correct: finalCorrect }));
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected('');
    setRevealed(false);
  };

  const restart = () => {
    setIdx(0);
    setSelected('');
    setRevealed(false);
    setAnswers({});
    setDone(false);
  };

  if (done) {
    const scorePct = Math.round((correctCount / total) * 100);
    return (
      <div className="space-y-3 rounded-card border border-border bg-surface-2/40 p-6 text-center">
        <div className="text-3xl font-bold gradient-text">{scorePct}%</div>
        <p className="text-sm text-text">
          {correctCount} / {total} correct · +{correctCount * 5} XP
        </p>
        <p className="mx-auto max-w-xs text-xs text-muted">{EMPTY.quizDone}</p>
        <button
          onClick={restart}
          className="rounded-md border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
        >
          <i className="pi pi-replay mr-1" aria-hidden />Retake
        </button>
      </div>
    );
  }

  const isCorrect = answers[q.id]?.correct ?? false;

  return (
    <div className="space-y-4 rounded-card border border-border bg-surface-2/40 p-4">
      <div className="flex items-center justify-between text-xs text-faint">
        <span className="font-mono">
          Q{idx + 1}/{total}
        </span>
        <span className="chip">{q.type === 'mcq' ? 'Multiple choice' : q.type === 'boolean' ? 'True / False' : 'Fill in the blank'}</span>
      </div>

      <p className="text-sm font-medium text-text">{q.prompt}</p>

      {q.type === 'mcq' && (
        <div className="space-y-1.5">
          {q.options.map((opt, i) => {
            const isChosen = selected === String(i);
            const showCorrect = revealed && i === q.answerIndex;
            const showWrong = revealed && isChosen && i !== q.answerIndex;
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setSelected(String(i))}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  showCorrect && 'border-success/50 bg-success/10 text-success',
                  showWrong && 'border-danger/50 bg-danger/10 text-danger',
                  !revealed && isChosen && 'border-accent/50 bg-accent/10 text-text',
                  !revealed && !isChosen && 'border-border text-muted hover:border-border-strong',
                  revealed && !showCorrect && !showWrong && 'border-border text-faint',
                )}
              >
                <span className="font-mono text-[11px] text-faint">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'boolean' && (
        <div className="flex gap-2">
          {['true', 'false'].map((v) => {
            const isChosen = selected === v;
            const showCorrect = revealed && (v === 'true') === q.answer;
            const showWrong = revealed && isChosen && (v === 'true') !== q.answer;
            return (
              <button
                key={v}
                disabled={revealed}
                onClick={() => setSelected(v)}
                className={cn(
                  'flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors',
                  showCorrect && 'border-success/50 bg-success/10 text-success',
                  showWrong && 'border-danger/50 bg-danger/10 text-danger',
                  !revealed && isChosen && 'border-accent/50 bg-accent/10 text-text',
                  !revealed && !isChosen && 'border-border text-muted hover:border-border-strong',
                )}
              >
                {v}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'fill' && (
        <input
          type="text"
          value={selected}
          disabled={revealed}
          onChange={(e) => setSelected(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Type your answer…"
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 font-mono text-sm text-text outline-none',
            revealed
              ? isCorrect
                ? 'border-success/50'
                : 'border-danger/50'
              : 'border-border focus:border-accent/50',
          )}
        />
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-md border p-3 text-xs',
            isCorrect ? 'border-success/30 bg-success/5 text-muted' : 'border-danger/30 bg-danger/5 text-muted',
          )}
        >
          <span className={cn('font-semibold', isCorrect ? 'text-success' : 'text-danger')}>
            {isCorrect ? 'Correct. ' : 'Not quite. '}
          </span>
          {q.explanation}
        </motion.div>
      )}

      <div className="flex justify-end">
        {!revealed ? (
          <button
            onClick={submit}
            disabled={selected === ''}
            className="rounded-md border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 disabled:opacity-40"
          >
            Check
          </button>
        ) : (
          <button
            onClick={advance}
            className="rounded-md border border-border bg-surface-2 px-4 py-1.5 text-xs font-medium text-text hover:border-border-strong"
          >
            {idx + 1 >= total ? 'See results' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  );
}
