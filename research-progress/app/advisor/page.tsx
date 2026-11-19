'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { Copy, GraduationCap, Save, Trash2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardHead, Label, Textarea, Button, Empty, Toast } from '@/components/ui';
import { copyText, uid, useLocalState } from '@/lib/utils';

type Report = {
  id: string;
  date: string;
  progress: string;
  problem: string;
  next: string;
  support: string;
};

const empty = { progress: '', problem: '', next: '', support: '' };

function buildText(r: Omit<Report, 'id' | 'date'>) {
  return `老师好，本周汇报如下：

一、进展
${r.progress || '（待补充）'}

二、遇到的问题
${r.problem || '（待补充）'}

三、下一步计划
${r.next || '（待补充）'}

四、需要老师的支持
${r.support || '（暂无）'}

谢谢老师！`;
}

export default function AdvisorPage() {
  const [form, setForm] = useState(empty);
  const [reports, setReports] = useLocalState<Report[]>('rpm.reports', []);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1600);
  };

  const text = buildText(form);

  const doCopy = async () => {
    const ok = await copyText(text);
    flash(ok ? '已复制，粘贴到微信或邮件即可' : '复制失败，请手动选择复制');
  };

  const save = () => {
    if (!form.progress.trim()) {
      flash('至少写一点进展，再保存');
      return;
    }
    setReports([{ id: uid(), date: dayjs().format('YYYY-MM-DD'), ...form }, ...reports]);
    flash('已保存本次汇报');
  };

  return (
    <div className="animate-fadeUp">
      <PageHeader
        label="Advisor · 导生关系"
        title="把汇报变成例行公事"
        description="四段式汇报：进展、问题、下一步、需要的支持。固定结构，能大幅降低开口成本。"
        right={
          <span className="flex items-center gap-1.5 text-[11px] text-sub">
            <GraduationCap size={14} strokeWidth={1.7} />
            建议每周一次，15 分钟讲完
          </span>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="填写汇报" hint="只写事实和计划，不写情绪化的自我评价。" />
          <div className="space-y-4 px-4 py-5 md:px-6">
            <div>
              <Label>一、进展（做了什么，有结果吗）</Label>
              <Textarea
                rows={3}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: e.target.value })}
                placeholder="例：完成了 XX 模块复现，在 XX 数据集上指标为 XX。"
              />
            </div>
            <div>
              <Label>二、问题（卡在哪，试过什么）</Label>
              <Textarea
                rows={3}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                placeholder="例：训练不稳定，尝试了降低学习率，仍然震荡。"
              />
            </div>
            <div>
              <Label>三、下一步计划</Label>
              <Textarea
                rows={3}
                value={form.next}
                onChange={(e) => setForm({ ...form, next: e.target.value })}
                placeholder="例：下周先做消融实验，再整理一版图表。"
              />
            </div>
            <div>
              <Label>四、需要老师的支持</Label>
              <Textarea
                rows={2}
                value={form.support}
                onChange={(e) => setForm({ ...form, support: e.target.value })}
                placeholder="例：希望老师帮忙确认实验方向是否值得继续。"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="md" onClick={doCopy} className="flex-1 justify-center">
                <Copy size={14} />
                一键复制
              </Button>
              <Button variant="ghost" size="md" onClick={save}>
                <Save size={14} />
                保存
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHead title="预览" hint="发送前扫一眼，删掉模糊的描述。" />
            <pre className="whitespace-pre-wrap px-4 py-5 font-sans text-[12.5px] leading-[1.9] text-ink md:px-6">
              {text}
            </pre>
          </Card>

          <Card>
            <CardHead title="历史汇报" hint="回看三周前的自己，会很有成就感。" />
            <div className="space-y-2 px-4 py-4 md:px-6">
              {reports.length === 0 ? (
                <Empty>还没有保存过汇报。</Empty>
              ) : (
                reports.map((r) => (
                  <details key={r.id} className="group rounded-xl border border-line bg-white/50">
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5">
                      <span className="flex-1 text-[12px] text-ink">{r.date} 的汇报</span>
                      <span className="text-[10px] text-sub/60">
                        {r.progress.slice(0, 12)}
                        {r.progress.length > 12 ? '…' : ''}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setReports(reports.filter((x) => x.id !== r.id));
                        }}
                        className="text-sub/40 hover:text-clay"
                        aria-label="删除汇报"
                      >
                        <Trash2 size={12} />
                      </button>
                    </summary>
                    <div className="border-t border-line/60 px-3.5 py-3">
                      <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-sub">
                        {buildText(r)}
                      </pre>
                      <Button
                        variant="quiet"
                        className="mt-2 px-0 text-[10px]"
                        onClick={() => {
                          setForm({ progress: r.progress, problem: r.problem, next: r.next, support: r.support });
                          flash('已载入到左侧表单');
                        }}
                      >
                        载入到左侧修改
                      </Button>
                    </div>
                  </details>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
      <Toast text={toast} />
    </div>
  );
}
