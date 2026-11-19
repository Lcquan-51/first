'use client';

import { useState } from 'react';
import { Check, Plus, Trash2, Users, ClipboardCheck, Mail } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardHead, Input, Button, Empty, cx, Label } from '@/components/ui';
import { uid, useLocalState } from '@/lib/utils';

const CHECKLIST: { group: string; note: string; items: { id: string; text: string }[] }[] = [
  {
    group: '会前',
    note: '带着目的去，而不是随波逐流',
    items: [
      { id: 'pre1', text: '从议程里选出 3 场必听报告' },
      { id: 'pre2', text: '准备 1 个能问出口的问题' },
      { id: 'pre3', text: '查 2 位想认识的人在研究什么' },
    ],
  },
  {
    group: '会中',
    note: '只记能带走的东西',
    items: [
      { id: 'in1', text: '每场只记 3 个关键词' },
      { id: 'in2', text: '记下 1 个可能用在自己课题里的方法' },
      { id: 'in3', text: '至少提问或交流 1 次' },
    ],
  },
  {
    group: '会后',
    note: '48 小时内不跟进，就等于没认识',
    items: [
      { id: 'post1', text: '48 小时内发出跟进邮件' },
      { id: 'post2', text: '把联系人和研究方向归档' },
      { id: 'post3', text: '写 3 行会议小结，放进文献/写作里' },
    ],
  },
];

type Contact = {
  id: string;
  name: string;
  org: string;
  field: string;
  status: string;
  note: string;
};

const STATUS = ['待联系', '已发邮件', '已回复', '持续跟进'];

export default function MeetingsPage() {
  const [checked, setChecked] = useLocalState<Record<string, boolean>>('rpm.meetingChecks', {});
  const [contacts, setContacts] = useLocalState<Contact[]>('rpm.contacts', []);
  const [form, setForm] = useState({ name: '', org: '', field: '', note: '' });

  const total = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;

  const add = () => {
    if (!form.name.trim()) return;
    setContacts([
      {
        id: uid(),
        name: form.name.trim(),
        org: form.org.trim(),
        field: form.field.trim(),
        status: '待联系',
        note: form.note.trim(),
      },
      ...contacts,
    ]);
    setForm({ name: '', org: '', field: '', note: '' });
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Meetings · 会议与社交"
        title="会议不是去打卡，是去建立连接"
        description="会前有目标、会中有记录、会后有跟进。三步做完，一场会才有价值。"
        right={
          <div className="text-right">
            <p className="text-[11px] text-sub">准备进度</p>
            <p className="mt-0.5 font-serif text-lg tabular-nums text-ink">
              {done} <span className="text-xs text-sub">/ {total}</span>
            </p>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          <Card>
            <CardHead
              title="会议准备清单"
              hint="每次开会前，从头到尾点一遍。"
              icon={<ClipboardCheck size={16} strokeWidth={1.7} />}
              action={
                <Button variant="quiet" onClick={() => setChecked({})}>
                  重置
                </Button>
              }
            />
            <div className="space-y-5 px-4 py-5 md:px-6">
              {CHECKLIST.map((g) => (
                <div key={g.group}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="font-serif text-[13px] text-ink">{g.group}</span>
                    <span className="text-[10px] text-sub/60">{g.note}</span>
                  </div>
                  <div className="space-y-1.5">
                    {g.items.map((item) => {
                      const on = !!checked[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => setChecked({ ...checked, [item.id]: !on })}
                          className={cx(
                            'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors',
                            on
                              ? 'border-sage/40 bg-sage-soft/50'
                              : 'border-line bg-white/40 hover:border-sage/40',
                          )}
                        >
                          <span
                            className={cx(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                              on ? 'border-sage-deep bg-sage-deep text-white' : 'border-sand text-transparent',
                            )}
                          >
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className={cx('text-[12px]', on ? 'text-sub line-through' : 'text-ink')}>
                            {item.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#EFEBE2]/60">
            <div className="px-6 py-5">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sub/70">
                <Mail size={12} /> 跟进邮件模板
              </p>
              <p className="mt-3 whitespace-pre-line font-serif text-[13px] leading-relaxed text-ink">
                {'X 老师 / X 同学，您好：\n我是 XX 大学的研一学生 XXX，在 XX 会议上听了您的报告，对 XX 很感兴趣。\n想请教一个具体问题：……\n感谢您的时间。'}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHead
            title="联系人"
            hint="记下人名、单位、方向；跟进状态比名片更有用。"
            icon={<Users size={16} strokeWidth={1.7} />}
          />
          <div className="space-y-2.5 border-b border-line/70 px-4 py-4 md:px-6">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>姓名</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="张老师" />
              </div>
              <div>
                <Label>单位</Label>
                <Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="XX 大学" />
              </div>
              <div>
                <Label>研究方向</Label>
                <Input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="语义通信" />
              </div>
              <div>
                <Label>备注</Label>
                <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="会议上的提问 / 邮箱" />
              </div>
            </div>
            <Button variant="primary" onClick={add} className="w-full justify-center py-2">
              <Plus size={13} />
              加入联系人
            </Button>
          </div>

          <div className="space-y-2 px-4 py-4 md:px-6">
            {contacts.length === 0 ? (
              <Empty>还没有联系人。下次会议，至少认识一个人。</Empty>
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="group rounded-xl border border-line bg-white/50 px-3.5 py-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-ink">
                        {c.name}
                        {c.org ? <span className="ml-1.5 font-normal text-sub/70">· {c.org}</span> : null}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-sub">{c.field || '方向待补充'}</p>
                      {c.note ? <p className="mt-1 text-[10.5px] leading-relaxed text-sub/70">{c.note}</p> : null}
                    </div>
                    <button
                      onClick={() => setContacts(contacts.filter((x) => x.id !== c.id))}
                      className="shrink-0 text-sub/30 opacity-0 transition-opacity hover:text-clay group-hover:opacity-100"
                      aria-label="删除联系人"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {STATUS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setContacts(contacts.map((x) => (x.id === c.id ? { ...x, status: s } : x)))}
                        className={cx(
                          'rounded-full px-2 py-0.5 text-[10px] transition-colors',
                          c.status === s
                            ? 'bg-sage-deep text-white'
                            : 'bg-[#F1EDE5] text-sub hover:bg-sage-soft',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
