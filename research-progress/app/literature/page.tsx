'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { BookOpen, Download, Plus, Tag, Trash2, X } from 'lucide-react';
import PageHeader from '@/components/page-header';
import Countdown from '@/components/countdown';
import { Card, CardHead, Input, Textarea, Label, Button, Empty, cx } from '@/components/ui';
import { downloadText, uid, useLocalState } from '@/lib/utils';

type Note = {
  id: string;
  title: string;
  tags: string[];
  question: string;
  method: string;
  conclusion: string;
  use: string;
  createdAt: string;
};

const emptyDraft = {
  title: '',
  question: '',
  method: '',
  conclusion: '',
  use: '',
  tags: [] as string[],
};

export default function LiteraturePage() {
  const [notes, setNotes] = useLocalState<Note[]>('rpm.notes', []);
  const [tags, setTags] = useLocalState<string[]>('rpm.tags', ['扩散模型', '三维重建', '综述']);
  const [draft, setDraft] = useState(emptyDraft);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    if (!draft.tags.includes(t)) setDraft({ ...draft, tags: [...draft.tags, t] });
    setTagInput('');
  };

  const save = () => {
    const required = [
      draft.question.trim(),
      draft.method.trim(),
      draft.conclusion.trim(),
      draft.use.trim(),
    ];
    if (!draft.title.trim() || required.some((v) => !v)) {
      setError('请把标题和四个核心字段都写完，再保存。');
      return;
    }
    setError('');
    setNotes([
      {
        id: uid(),
        title: draft.title.trim(),
        tags: draft.tags,
        question: draft.question.trim(),
        method: draft.method.trim(),
        conclusion: draft.conclusion.trim(),
        use: draft.use.trim(),
        createdAt: dayjs().format('YYYY-MM-DD'),
      },
      ...notes,
    ]);
    setDraft(emptyDraft);
  };

  const exportMd = () => {
    if (!notes.length) return;
    const body = notes
      .map(
        (n) => `## ${n.title}

- 日期：${n.createdAt}
- 标签：${n.tags.length ? n.tags.map((t) => `#${t}`).join(' ') : '无'}

**问题**
${n.question}

**方法**
${n.method}

**结论**
${n.conclusion}

**我能用在哪**
${n.use}
`,
      )
      .join('\n---\n\n');
    downloadText(
      `文献笔记-${dayjs().format('YYYYMMDD')}.md`,
      `# 文献笔记\n\n导出时间：${dayjs().format('YYYY-MM-DD HH:mm')}\n\n${body}`,
    );
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Literature · 文献阅读"
        title="三十分钟，读透一篇"
        description="读完不等于读懂。用自己的话写完四个字段，才算真的读进去了。"
        right={
          <Button variant="ghost" size="md" onClick={exportMd} disabled={!notes.length}>
            <Download size={14} />
            导出 Markdown
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="space-y-5">
          <Card>
            <CardHead
              title="30 分钟阅读节奏"
              hint="10 分钟看结构，10 分钟看方法，10 分钟写笔记。"
              icon={<BookOpen size={16} strokeWidth={1.7} />}
            />
            <div className="px-6 py-6">
              <Countdown
                minutes={30}
                segments={[10, 10, 10]}
                segmentLabels={['看结构', '读方法', '写笔记']}
              />
            </div>
          </Card>

          <Card>
            <CardHead
              title="标签库"
              hint="给笔记一点分类，之后写综述会轻松很多。"
              icon={<Tag size={16} strokeWidth={1.7} />}
            />
            <div className="px-4 py-4 md:px-6">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="新标签，如：语义分割"
                />
                <Button variant="ghost" onClick={addTag} className="shrink-0 px-4">
                  <Plus size={13} />
                  添加
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.length === 0 ? (
                  <p className="text-[11px] text-sub/70">还没有标签。</p>
                ) : (
                  tags.map((t) => (
                    <span
                      key={t}
                      className="group inline-flex items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 text-[11px] text-sage-deep"
                    >
                      {t}
                      <button
                        onClick={() => {
                          setTags(tags.filter((x) => x !== t));
                          setDraft({ ...draft, tags: draft.tags.filter((x) => x !== t) });
                        }}
                        className="text-sage-deep/50 hover:text-clay"
                        aria-label={`删除标签 ${t}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHead
            title="文献笔记"
            hint="四个字段，缺一不可。写不出来，说明还没读懂。"
          />
          <div className="space-y-4 px-4 py-5 md:px-6">
            <div>
              <Label>论文标题</Label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="例如：NeRF: Representing Scenes as Neural Radiance Fields"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>问题（它要解决什么）</Label>
                <Textarea
                  rows={3}
                  value={draft.question}
                  onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  placeholder="作者认为现有方法哪里不够好？"
                />
              </div>
              <div>
                <Label>方法（它怎么做的）</Label>
                <Textarea
                  rows={3}
                  value={draft.method}
                  onChange={(e) => setDraft({ ...draft, method: e.target.value })}
                  placeholder="核心模块 / 损失函数 / 数据流程"
                />
              </div>
              <div>
                <Label>结论（它证明了什么）</Label>
                <Textarea
                  rows={3}
                  value={draft.conclusion}
                  onChange={(e) => setDraft({ ...draft, conclusion: e.target.value })}
                  placeholder="实验支持了哪个假设？"
                />
              </div>
              <div>
                <Label>我能用在哪</Label>
                <Textarea
                  rows={3}
                  value={draft.use}
                  onChange={(e) => setDraft({ ...draft, use: e.target.value })}
                  placeholder="和我自己的课题有什么关系？"
                />
              </div>
            </div>

            <div>
              <Label>选择标签</Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.length === 0 ? (
                  <p className="text-[11px] text-sub/70">先在上方标签库添加标签。</p>
                ) : (
                  tags.map((t) => {
                    const on = draft.tags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            tags: on ? draft.tags.filter((x) => x !== t) : [...draft.tags, t],
                          })
                        }
                        className={cx(
                          'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                          on
                            ? 'border-sage-deep bg-sage-deep text-white'
                            : 'border-line text-sub hover:border-sage',
                        )}
                      >
                        {t}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {error ? <p className="text-[11px] text-clay">{error}</p> : null}

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-sub/70">写完四个字段再保存。</p>
              <Button variant="primary" size="md" onClick={save}>
                保存笔记
              </Button>
            </div>
          </div>

          <div className="border-t border-line/70 px-4 py-4 md:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-ink">已保存 {notes.length} 篇</p>
            </div>
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <Empty>还没有笔记。读完第一篇，就写第一条。</Empty>
              ) : (
                notes.map((n) => (
                  <details key={n.id} className="group rounded-xl border border-line bg-white/50">
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5">
                      <span className="flex-1 truncate text-[12px] text-ink">{n.title}</span>
                      <span className="shrink-0 text-[10px] text-sub/60">{n.createdAt}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setNotes(notes.filter((x) => x.id !== n.id));
                        }}
                        className="shrink-0 text-sub/50 hover:text-clay"
                        aria-label="删除笔记"
                      >
                        <Trash2 size={13} />
                      </button>
                    </summary>
                    <div className="space-y-2 border-t border-line/60 px-3.5 py-3 text-[11px] leading-relaxed text-sub">
                      <p><span className="text-ink">问题：</span>{n.question}</p>
                      <p><span className="text-ink">方法：</span>{n.method}</p>
                      <p><span className="text-ink">结论：</span>{n.conclusion}</p>
                      <p><span className="text-ink">用在哪：</span>{n.use}</p>
                      {n.tags.length ? (
                        <p className="flex flex-wrap gap-1 pt-1">
                          {n.tags.map((t) => (
                            <span key={t} className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] text-sage-deep">
                              #{t}
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  </details>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
