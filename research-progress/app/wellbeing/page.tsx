'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Activity, HeartPulse, Play, Square, Trash2, Wind } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardHead, Textarea, Button, Label, Empty, cx } from '@/components/ui';
import { uid, useLocalState } from '@/lib/utils';

const MOODS = [
  { key: '平静', color: '#8CA08C' },
  { key: '开心', color: '#C7B98A' },
  { key: '焦虑', color: '#B99B8A' },
  { key: '烦躁', color: '#B58E86' },
  { key: '疲惫', color: '#A9B3BC' },
  { key: '低落', color: '#9AA3A8' },
];

const BURNOUT = [
  '最近睡不好，入睡困难或早醒',
  '对原本感兴趣的研究失去兴趣',
  '效率明显降低，一件事拖很久',
  '开始回避组会、消息和社交',
  '身体持续不适：头痛、胃痛、心慌',
  '一想到科研就感到厌倦或抗拒',
];

type Mood = { id: string; date: string; mood: string; note: string };

const CYCLE = 19;

export default function WellbeingPage() {
  const [moods, setMoods] = useLocalState<Mood[]>('rpm.moods', []);
  const [mood, setMood] = useState('平静');
  const [note, setNote] = useState('');
  const [checks, setChecks] = useLocalState<boolean[]>('rpm.burnout', Array(6).fill(false));

  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const el = tick % CYCLE;
  const phase = !running ? 'idle' : el < 4 ? 'in' : el < 11 ? 'hold' : 'out';
  const left = !running ? 0 : el < 4 ? 4 - el : el < 11 ? 11 - el : CYCLE - el;
  const scale = !running ? 0.68 : phase === 'in' ? 1 : phase === 'hold' ? 1 : 0.68;
  const duration = !running ? 0.6 : phase === 'in' ? 4 : phase === 'out' ? 8 : 1;
  const phaseLabel = { idle: '准备好了吗', in: '吸气', hold: '屏息', out: '呼气' }[phase];

  const score = checks.filter(Boolean).length;
  const verdict =
    score <= 1
      ? { text: '目前状态稳定。保持睡眠和运动。', tone: 'good' as const }
      : score <= 3
        ? { text: '出现了一些耗竭信号。这周主动减少一件事，早点睡。', tone: 'warn' as const }
        : { text: '耗竭程度偏高。请认真休息，并找一个信任的人聊聊；必要时寻求学校心理中心帮助。', tone: 'alert' as const };

  const addMood = () => {
    setMoods([
      { id: uid(), date: dayjs().format('YYYY-MM-DD'), mood, note: note.trim() },
      ...moods,
    ]);
    setNote('');
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Wellbeing · 情绪与精力"
        title="先照顾好人，再谈进度"
        description="科研是长跑。情绪不是干扰项，是需要被看见的信号。"
        right={
          <span className="flex items-center gap-1.5 text-[11px] text-sub">
            <HeartPulse size={14} strokeWidth={1.7} />
            每周自测一次即可
          </span>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 情绪日记 */}
        <Card>
          <CardHead
            title="情绪日记"
            hint="一句话写清楚：发生了什么，我感觉如何。"
            icon={<Activity size={16} strokeWidth={1.7} />}
          />
          <div className="px-4 py-5 md:px-6">
            <Label>今天的情绪</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const on = mood === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={cx(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors',
                      on ? 'border-ink/20 bg-white text-ink shadow-sm' : 'border-line text-sub hover:bg-white/60',
                    )}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: m.color, opacity: on ? 1 : 0.55 }}
                    />
                    {m.key}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <Label>发生了什么（可选）</Label>
              <Textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例：组会被问住了，觉得自己很差；但下午跑完步好多了。"
              />
            </div>
            <Button variant="primary" onClick={addMood} className="mt-3 w-full justify-center py-2">
              记下今天
            </Button>

            <div className="mt-5 max-h-[260px] space-y-2 overflow-y-auto pr-1">
              {moods.length === 0 ? (
                <Empty>还没有记录。今天的一行，就是起点。</Empty>
              ) : (
                moods.map((m) => {
                  const color = MOODS.find((x) => x.key === m.mood)?.color ?? '#8CA08C';
                  return (
                    <div key={m.id} className="group flex gap-2.5 rounded-xl border border-line bg-white/50 px-3.5 py-2.5">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-sub/70">
                          {m.date} · <span className="text-ink">{m.mood}</span>
                        </p>
                        {m.note ? <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink/80">{m.note}</p> : null}
                      </div>
                      <button
                        onClick={() => setMoods(moods.filter((x) => x.id !== m.id))}
                        className="shrink-0 text-sub/30 opacity-0 transition-opacity hover:text-clay group-hover:opacity-100"
                        aria-label="删除记录"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          {/* Burnout 自测 */}
          <Card>
            <CardHead
              title="Burnout 自测"
              hint="最近两周，符合几项？"
              icon={<HeartPulse size={16} strokeWidth={1.7} />}
            />
            <div className="space-y-1.5 px-4 py-4 md:px-6">
              {BURNOUT.map((q, i) => {
                const on = !!checks[i];
                return (
                  <button
                    key={q}
                    onClick={() => {
                      const next = [...checks];
                      next[i] = !on;
                      setChecks(next);
                    }}
                    className={cx(
                      'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[12px] transition-colors',
                      on ? 'border-clay/50 bg-clay-soft/60 text-ink' : 'border-line bg-white/40 text-sub hover:border-sand',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px]',
                        on ? 'border-clay bg-clay text-white' : 'border-sand text-transparent',
                      )}
                    >
                      ✓
                    </span>
                    {q}
                  </button>
                );
              })}
              <div
                className={cx(
                  'mt-3 rounded-xl px-3.5 py-3 text-[11.5px] leading-relaxed',
                  verdict.tone === 'good'
                    ? 'bg-sage-soft text-sage-deep'
                    : verdict.tone === 'warn'
                      ? 'bg-[#F4EBD9] text-[#8A7047]'
                      : 'bg-clay-soft text-[#8E5F4E]',
                )}
              >
                <span className="mr-1.5 font-medium">{score} / 6</span>
                {verdict.text}
              </div>
              <p className="pt-1 text-[10px] leading-relaxed text-sub/60">
                这里只是提醒，不是诊断。持续不适请预约学校心理咨询。
              </p>
            </div>
          </Card>

          {/* 4-7-8 呼吸 */}
          <Card>
            <CardHead
              title="4-7-8 呼吸放松"
              hint="吸气 4 秒，屏息 7 秒，呼气 8 秒。"
              icon={<Wind size={16} strokeWidth={1.7} />}
              action={
                <Button
                  variant={running ? 'ghost' : 'primary'}
                  onClick={() => {
                    if (running) {
                      setRunning(false);
                      setTick(0);
                    } else {
                      setTick(0);
                      setRunning(true);
                    }
                  }}
                >
                  {running ? <Square size={12} /> : <Play size={12} />}
                  {running ? '停止' : '开始'}
                </Button>
              }
            />
            <div className="flex flex-col items-center px-6 py-6">
              <div className="relative flex h-[168px] w-[168px] items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#E9EEE7]" />
                <div
                  className="absolute inset-0 rounded-full border border-sage/40 bg-sage-soft"
                  style={{
                    transform: `scale(${scale})`,
                    transition: `transform ${duration}s ease-in-out`,
                  }}
                />
                <div className="relative text-center">
                  <p className="font-serif text-[15px] text-sage-deep">{phaseLabel}</p>
                  <p className="mt-1 font-serif text-2xl tabular-nums text-ink">
                    {running ? left : '—'}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-center text-[11px] leading-relaxed text-sub/80">
                {running
                  ? `已完成 ${Math.floor(tick / CYCLE)} 轮 · 建议做 4 轮`
                  : '找一个安静的姿势，肩膀放松。'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
