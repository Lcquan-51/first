'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Smartphone } from 'lucide-react';
import { Button, cx } from './ui';

type Props = {
  minutes: number;
  /** 分段时长（分钟），如 [10, 10, 10] */
  segments?: number[];
  segmentLabels?: string[];
  /** 运行时压暗整屏，提醒远离手机 */
  dimOnRun?: boolean;
  hint?: string;
  tone?: 'sage' | 'clay';
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Countdown({
  minutes,
  segments,
  segmentLabels,
  dimOnRun = false,
  hint,
  tone = 'sage',
}: Props) {
  const total = useMemo(
    () => (segments?.length ? segments.reduce((a, b) => a + b, 0) : minutes) * 60,
    [minutes, segments],
  );
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => setLeft(total), [total]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0 && running) {
      setRunning(false);
      if (!finishedRef.current) {
        finishedRef.current = true;
        document.title = '时间到 · 研一科研进度管理器';
      }
    }
    if (left > 0) finishedRef.current = false;
  }, [left, running]);

  const elapsed = total - left;
  const progress = total ? elapsed / total : 0;

  let segmentIndex = -1;
  if (segments?.length) {
    let acc = 0;
    segmentIndex = segments.length - 1;
    for (let i = 0; i < segments.length; i += 1) {
      if (elapsed < acc + segments[i] * 60) {
        segmentIndex = i;
        break;
      }
      acc += segments[i] * 60;
    }
  }

  const segmentLeft = segments?.length
    ? (() => {
        let acc = 0;
        for (let i = 0; i < segments.length; i += 1) {
          if (elapsed < acc + segments[i] * 60) return acc + segments[i] * 60 - elapsed;
          acc += segments[i] * 60;
        }
        return 0;
      })()
    : left;

  const reset = () => {
    setRunning(false);
    setLeft(total);
    finishedRef.current = false;
  };

  const ringColor = tone === 'clay' ? '#B99B8A' : '#6E8570';

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative h-[188px] w-[188px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#E6DFD3" strokeWidth="3" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[34px] tabular-nums tracking-tight text-ink">
              {fmt(segments?.length ? segmentLeft : left)}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-sub/70">
              {finishedRef.current && left === 0
                ? '完成'
                : segments?.length
                  ? `第 ${Math.max(segmentIndex + 1, 1)} / ${segments.length} 段`
                  : running
                    ? '专注中'
                    : '准备'}
            </span>
          </div>
        </div>

        {segments?.length ? (
          <div className="mt-5 flex w-full gap-1.5">
            {segments.map((m, i) => {
              const start = segments.slice(0, i).reduce((a, b) => a + b, 0) * 60;
              const ratio = Math.min(Math.max((elapsed - start) / (m * 60), 0), 1);
              return (
                <div key={i} className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-sage-deep" style={{ width: `${ratio * 100}%` }} />
                  </div>
                  <p className={cx('mt-1.5 text-center text-[10px]', i === segmentIndex ? 'text-sage-deep' : 'text-sub/60')}>
                    {segmentLabels?.[i] ?? `${m} 分钟`}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-2">
          <Button variant="primary" size="md" onClick={() => setRunning((r) => !r)} className="min-w-[104px]">
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? '暂停' : left === 0 ? '再来一次' : '开始'}
          </Button>
          <Button variant="ghost" size="md" onClick={reset} aria-label="重置">
            <RotateCcw size={14} />
            重置
          </Button>
        </div>

        {hint ? <p className="mt-4 text-center text-[11px] leading-relaxed text-sub/80">{hint}</p> : null}
      </div>

      {dimOnRun && running ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#2E332F] px-6 text-white">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
            <Smartphone size={13} /> 手机放远
          </p>
          <p className="mt-6 font-serif text-[76px] tabular-nums leading-none tracking-tight text-white/95">
            {fmt(left)}
          </p>
          <p className="mt-6 max-w-xs text-center text-xs leading-relaxed text-white/50">
            九十分钟，只做这一件事。
            <br />
            走神也没关系，回来就好。
          </p>
          <div className="mt-10 flex gap-3">
            <button
              onClick={() => setRunning(false)}
              className="rounded-full border border-white/25 px-6 py-2 text-xs text-white/80 transition-colors hover:bg-white/10"
            >
              暂停一下
            </button>
            <button
              onClick={reset}
              className="rounded-full px-6 py-2 text-xs text-white/40 transition-colors hover:text-white/70"
            >
              放弃本轮
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
