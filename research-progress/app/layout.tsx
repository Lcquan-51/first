import type { Metadata, Viewport } from 'next';
import './globals.css';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: '研一科研进度管理器',
  description: '践行科研 SOP：聚焦每天三件事，管理文献、写作、会议与精力。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F2EC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <div className="min-h-screen">
          <Sidebar />
          <main className="lg:pl-[236px]">
            <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-6 md:px-10 lg:pt-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
