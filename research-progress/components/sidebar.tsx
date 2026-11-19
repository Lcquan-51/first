'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  PenLine,
  Users,
  Wind,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cx } from './ui';

const NAV = [
  { href: '/', label: '今日看板', en: 'Today', icon: LayoutDashboard },
  { href: '/literature/', label: '文献阅读', en: 'Literature', icon: BookOpen },
  { href: '/writing/', label: '论文与投稿', en: 'Writing', icon: PenLine },
  { href: '/meetings/', label: '会议与社交', en: 'Meetings', icon: Users },
  { href: '/advisor/', label: '导生关系', en: 'Advisor', icon: GraduationCap },
  { href: '/wellbeing/', label: '情绪与精力', en: 'Wellbeing', icon: Wind },
];

export default function Sidebar() {
  const pathname = usePathname() || '/';
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col border-r border-line bg-[#F1EDE5] px-5 py-8 lg:flex">
        <div className="px-2">
          <p className="font-serif text-[19px] leading-tight tracking-wide text-ink">
            研一科研
            <br />
            进度管理器
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-sub/70">
            Research OS
          </p>
        </div>

        <nav className="mt-10 flex-1 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = active(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors',
                  on
                    ? 'bg-white/80 text-sage-deep shadow-[0_1px_2px_rgba(59,64,56,0.04)]'
                    : 'text-sub hover:bg-white/50 hover:text-ink',
                )}
              >
                <Icon size={17} strokeWidth={1.7} className={on ? 'text-sage-deep' : 'text-sub/80'} />
                <span className="flex-1">{item.label}</span>
                <span className={cx('text-[9px] uppercase tracking-[0.14em]', on ? 'text-sage' : 'text-sub/40')}>
                  {item.en}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl border border-line/80 bg-white/40 px-3.5 py-3">
          <p className="text-[11px] text-sub">今天</p>
          <p className="mt-0.5 font-serif text-sm text-ink" suppressHydrationWarning>
            {dayjs().format('YYYY 年 M 月 D 日')}
          </p>
          <p className="mt-2 border-t border-line/70 pt-2 text-[10px] leading-relaxed text-sub/80">
            数据只保存在本机浏览器
            <br />
            慢一点，也是在前进
          </p>
        </div>
      </aside>

      {/* 移动端顶栏 */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-serif text-[15px] text-ink">研一科研进度管理器</span>
          <span className="flex items-center gap-1 text-[11px] text-sub" suppressHydrationWarning>
            <CalendarDays size={13} strokeWidth={1.7} />
            {dayjs().format('M月D日')}
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = active(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px]',
                  on ? 'bg-sage-deep text-white' : 'text-sub hover:bg-white',
                )}
              >
                <Icon size={13} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
