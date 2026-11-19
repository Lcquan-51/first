'use client';

import dayjs from 'dayjs';
import { Check, Circle, Sparkles, Timer, MoonStar } from 'lucide-react';
import PageHeader from '@/components/page-header';
import Countdown from '@/components/countdown';
import { Card, CardHead, Input, Textarea, Label, Button, cx } from '@/components/ui';
import { useLocalState } from '@/lib/utils';

type Task = { text: string; done: boolean };
type TodayData = { date: string; tasks: Task[] };
type Review = { did: string; drain: string; tomorrow: string };

const today = dayjs().format('YYYY-MM-DD');

const emptyTasks = (): Task[] => [
  { text: '', done: false },
  { text: '', done: false },
  { text: '', done: false },
];

export default function DashboardPage() {
  const [data, setData] = useLocalState<TodayData>('rpm.today', {
    date: today,
    tasks: emptyTasks(),
  });
  const [review, setReview] = useLocalState<Review>(`rpm.review.${today}`, {
    did: '',
    drain: '',
    tomorrow: '',
  });

  const tasks = data.date === today && data.tasks.length === 3 ? data.tasks : emptyTasks();
  const doneCount = tasks.filter((t) => t.done && t.text.trim()).length;
  const filled = tasks.filter((t) => t.text.trim()).length;

  const update = (index: number, patch: Partial<Task>) => {
    const next = tasks.map((t, i) => (i === index ? { ...t, ...patch } : t));
    setData({ date: today, tasks: next });
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Today · 今日看板"
        title="今天，只做三件事"
        description="研一不是把所有事做完，而是把最重要的事往前推一点。"
        right={
          <div className="text-right" suppressHydrationWarning>
            <p className="font-serif text-[15px] text-ink">{dayjs().format('M 月 D 日')}</p>
            <p className="mt-0.5 text-[11px] tracking-wide text-sub">
              {['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dayjs().day()]}
            </p>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {/* 三件事 */}
          <Card>
            <CardHead
              title="今天最重要的三件事"
              hint="写满三件就好。做不完也没关系，先做第一件。"
              icon={<Sparkles size={16} strokeWidth={1.7} />}
              action={
                <span className="rounded-full bg-sage-soft px-3 py-1 text-[11px] tabular-nums text-sage-deep">
                  {doneCount} / {filled || 3}
                </span>
              }
            />
            <div className="space-y-2.5 px-4 py-5 md:px-6">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className={cx(
                    'group flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors',
                    task.done && task.text.trim()
                      ? 'border-sage/40 bg-sage-soft/50'
                      : 'border-line bg-white/50 focus-within:border-sage/60',
                  )}
                >
                  <button
                    onClick={() => task.text.trim() && update(i, { done: !task.done })}
                    aria-label={task.done ? '标记未完成' : '标记完成'}
                    className={cx(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                      task.done && task.text.trim()
                        ? 'border-sage-deep bg-sage-deep text-white'
                        : 'border-sand text-transparent hover:border-sage',
                    )}
                  >
                    {task.done ? <Check size={12} strokeWidth={2.5} /> : <Circle size={0} />}
                  </button>
                  <span className="w-4 shrink-0 font-serif text-xs text-sub/60">{['一', '二', '三'][i]}</span>
                  <input
                    value={task.text}
                    onChange={(e) => update(i, { text: e.target.value })}
                    placeholder={
                      ['把最重要的一件事写在这里', '其次', '如果还有余力'][i]
                    }
                    className={cx(
                      'w-full bg-transparent text-sm text-ink placeholder:text-sub/50',
                      task.done && task.text.trim() && 'text-sub line-through decoration-sage/60',
                    )}
                  />
                </div>
              ))}
              <p className="pt-1 text-[11px] leading-relaxed text-sub/70">
                不设第四项。多出来的想法，放到「文献」或「写作」里，明天再说。
              </p>
            </div>
          </Card>

          {/* 睡前复盘 */}
          <Card>
            <CardHead
              title="睡前复盘"
              hint="三分钟，把今天合上，才能安心睡觉。"
              icon={<MoonStar size={16} strokeWidth={1.7} />}
            />
            <div className="grid gap-4 px-4 py-5 md:grid-cols-3 md:px-6">
              <div>
                <Label>今天做了什么</Label>
                <Textarea
                  rows={3}
                  value={review.did}
                  onChange={(e) => setReview({ ...review, did: e.target.value })}
                  placeholder="哪怕只读了两页论文，也算。"
                />
              </div>
              <div>
                <Label>什么事耗我</Label>
                <Textarea
                  rows={3}
                  value={review.drain}
                  onChange={(e) => setReview({ ...review, drain: e.target.value })}
                  placeholder="写下来，明天避开它。"
                />
              </div>
              <div>
                <Label>明天最重要的一件事</Label>
                <Textarea
                  rows={3}
                  value={review.tomorrow}
                  onChange={(e) => setReview({ ...review, tomorrow: e.target.value })}
                  placeholder="只写一件。"
                />
              </div>
            </div>
            <div className="border-t border-line/70 px-4 py-3 md:px-6">
              <p className="text-[11px] text-sub/70" suppressHydrationWarning>
                自动保存在本机 · {dayjs().format('YYYY-MM-DD')}
              </p>
            </div>
          </Card>
        </div>

        {/* 右侧：深度工作 */}
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardHead
              title="深度工作 90 分钟"
              hint="开始后屏幕会变暗，请把手机放到看不见的地方。"
              icon={<Timer size={16} strokeWidth={1.7} />}
            />
            <div className="px-6 py-7">
              <Countdown
                minutes={90}
                dimOnRun
                hint="一轮 90 分钟，结束后休息 15 分钟，再决定要不要第二轮。"
              />
            </div>
          </Card>

          <Card className="bg-[#EFEBE2]/60">
            <div className="px-6 py-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sub/70">今日提醒</p>
              <p className="mt-3 font-serif text-[15px] leading-relaxed text-ink">
                焦虑往往来自「想做的太多」。
                <br />
                今天，只把一件事做深。
              </p>
              <div className="mt-4 h-px w-10 bg-sand" />
              <p className="mt-4 text-[11px] leading-relaxed text-sub">
                完成三件事中的一件，今天就算成功。
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
