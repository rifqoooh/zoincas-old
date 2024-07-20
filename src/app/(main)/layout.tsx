import { ReactNode } from 'react';
import { SidebarLayout } from '../../components/sidebar-layout';
import { createClient } from '@/lib/supabase/auth/server';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error || !auth?.user) {
    redirect('/login');
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
