'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { Check, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardHead, Input, Button, Empty, cx, Label, Textarea } from '@/components/ui';
import { uid, useLocalState } from '@/lib/utils';

const COLUMNS = [
  { id: 'outline', label: '大纲', hint: '先想清楚结构' },
  { id: 'draft', label: '初稿（垃圾版）', hint: '允许写得很烂' },
  { id: 'rev1', label: '第一遍（结构）', hint: '顺序与逻辑' },
  { id: 'rev2', label: '第二遍（论证）', hint: '证据与推理' },
  { id: 'rev3', label: '第三遍（语言）', hint: '句子与格式' },
];

type Paper = { id: string; title: string; col: string; updatedAt: string };

type Submission = {
  id: string;
  journal: string;
  date: string;
  status: string;
  next: string;
};

const STATUS = ['准备中', '已投稿', '审稿中', '返修', '录用', '拒稿'];

export default function WritingPage() {
  const [papers, setPapers] = useLocalState<Paper[]>('rpm.papers', []);
  const [subs, setSubs] = useLocalState<Submission[]>('rpm.submissions', []);
  const [adding, setAdding] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const [form, setForm] = useState({ journal: '', date: dayjs().format('YYYY-MM-DD'), status: '准备中', next: '' });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Submission | null>(null);

  const addPaper = (col: string) => {
    if (!draftTitle.trim()) return;
    setPapers([
      ...papers,
      { id: uid(), title: draftTitle.trim(), col, updatedAt: dayjs().format('MM-DD') },
    ]);
    setDraftTitle('');
    setAdding(null);
  };

  const drop = (col: string) => {
    if (!dragId) return;
    setPapers(
      papers.map((p) =>
        p.id === dragId ? { ...p, col, updatedAt: dayjs().format('MM-DD') } : p,
      ),
    );
    setDragId(null);
    setOverCol(null);
  };

  const addSub = () => {
    if (!form.journal.trim()) return;
    setSubs([
      { id: uid(), journal: form.journal.trim(), date: form.date, status: form.status, next: form.next.trim() },
      ...subs,
    ]);
    setForm({ journal: '', date: dayjs().format('YYYY-MM-DD'), status: '准备中', next: '' });
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Writing · 论文与投稿"
        title="把论文拆成五步，一步一步过"
        description="写作不是一次性完成，而是五遍不同的工作。拖到下一列，就是一次真实的进展。"
      />

      <Card className="mb-5">
        <CardHead
          title="写作看板"
          hint="拖动卡片推进状态；每一列只关心一件事。"
        />
        <div className="overflow-x-auto px-4 py-5 md:px-6">
          <div className="flex min-w-[860px] gap-3">
            {COLUMNS.map((col) => {
              const items = papers.filter((p) => p.col === col.id);
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverCol(col.id);
                  }}
                  onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                  onDrop={() => drop(col.id)}
                  className={cx(
                    'flex w-[196px] shrink-0 flex-col rounded-xl border border-dashed p-2.5 transition-colors',
                    overCol === col.id ? 'border-sage bg-sage-soft/40' : 'border-line bg-[#F3EFE7]/50',
                  )}
                >
                  <div className="mb-2.5 px-1">
                    <p className="text-[12px] font-medium text-ink">{col.label}</p>
                    <p className="mt-0.5 text-[10px] text-sub/60">{col.hint}</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {items.map((p) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => setDragId(p.id)}
                        onDragEnd={() => setDragId(null)}
                        className={cx(
                          'group cursor-grab rounded-lg border border-line bg-card px-2.5 py-2.5 shadow-sm active:cursor-grabbing',
                          dragId === p.id && 'opacity-50',
                        )}
                      >
                        <div className="flex items-start gap-1.5">
                          <GripVertical size={12} className="mt-0.5 shrink-0 text-sub/30" />
                          <p className="flex-1 text-[11.5px] leading-snug text-ink">{p.title}</p>
                          <button
                            onClick={() => setPapers(papers.filter((x) => x.id !== p.id))}
                            className="shrink-0 text-sub/25 opacity-0 transition-opacity hover:text-clay group-hover:opacity-100"
                            aria-label="删除"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                        <p className="mt-1.5 pl-4 text-[9px] text-sub/50">{p.updatedAt}</p>
                      </div>
                    ))}
                    {items.length === 0 ? (
                      <p className="py-3 text-center text-[10px] text-sub/40">空</p>
                    ) : null}
                  </div>

                  {adding === col.id ? (
                    <div className="mt-2 flex gap-1">
                      <input
                        autoFocus
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPaper(col.id)}
                        placeholder="论文 / 章节名"
                        className="w-full rounded-md border border-sage/50 bg-white px-2 py-1 text-[11px]"
                      />
                      <button
                        onClick={() => addPaper(col.id)}
                        className="shrink-0 text-sage-deep"
                        aria-label="确认添加"
                      >
                        <Check size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAdding(col.id);
                        setDraftTitle('');
                      }}
                      className="mt-2 flex items-center justify-center gap-1 rounded-md py-1.5 text-[10px] text-sub/60 hover:bg-white hover:text-sage-deep"
                    >
                      <Plus size={11} /> 添加
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="投稿记录" hint="期刊、日期、状态、下一步——只记这四个就够。" />
        <div className="grid gap-2.5 border-b border-line/70 bg-[#F8F5EF]/60 px-4 py-4 md:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr_auto] md:px-6">
          <Input
            value={form.journal}
            onChange={(e) => setForm({ ...form, journal: e.target.value })}
            placeholder="期刊 / 会议名"
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-xl border border-line bg-white/60 px-3 py-2.5 text-sm text-ink focus:border-sage"
          >
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Input
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
            placeholder="下一步，如：补充消融实验"
          />
          <Button variant="primary" onClick={addSub} className="justify-center px-4">
            <Plus size={13} />
            记录
          </Button>
        </div>

        <div className="px-4 py-4 md:px-6">
          {subs.length === 0 ? (
            <Empty>还没有投稿记录。第一次投出去，值得被记下来。</Empty>
          ) : (
            <div className="space-y-2">
              {subs.map((s) =>
                editing === s.id && editForm ? (
                  <div key={s.id} className="grid gap-2 rounded-xl border border-sage/40 bg-white/70 p-3 md:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr_auto]">
                    <Input value={editForm.journal} onChange={(e) => setEditForm({ ...editForm, journal: e.target.value })} />
                    <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
                    >
                      {STATUS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    <Input value={editForm.next} onChange={(e) => setEditForm({ ...editForm, next: e.target.value })} />
                    <div className="flex gap-1">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSubs(subs.map((x) => (x.id === s.id ? editForm : x)));
                          setEditing(null);
                          setEditForm(null);
                        }}
                      >
                        <Check size={13} />
                      </Button>
                      <Button variant="quiet" onClick={() => { setEditing(null); setEditForm(null); }}>
                        <X size={13} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={s.id}
                    className="group grid items-center gap-2 rounded-xl border border-line bg-white/50 px-3.5 py-2.5 text-[12px] md:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr_auto]"
                  >
                    <span className="truncate font-medium text-ink">{s.journal}</span>
                    <span className="text-sub">{s.date || '—'}</span>
                    <span>
                      <span
                        className={cx(
                          'rounded-full px-2 py-0.5 text-[10px]',
                          s.status === '录用'
                            ? 'bg-sage-soft text-sage-deep'
                            : s.status === '拒稿'
                              ? 'bg-clay-soft text-clay'
                              : 'bg-mist-soft text-[#6B7780]',
                        )}
                      >
                        {s.status}
                      </span>
                    </span>
                    <span className="truncate text-sub">{s.next || '—'}</span>
                    <span className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => { setEditing(s.id); setEditForm(s); }}
                        className="text-sub/60 hover:text-sage-deep"
                        aria-label="编辑"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setSubs(subs.filter((x) => x.id !== s.id))}
                        className="text-sub/60 hover:text-clay"
                        aria-label="删除"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
