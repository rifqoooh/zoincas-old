import { createClient } from '@/lib/supabase/auth/server';
import { MoblieNav } from './mobile-nav';
import { DesktopNav } from './desktop-nav';

export async function Navigation() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    // user not logged in
    return (
      <>
        {/* desktop navigation */}
        <div className="hidden items-center md:flex">
          <DesktopNav />
        </div>

        {/* mobile navigation */}
        <div className="md:hidden">
          <MoblieNav />
        </div>
      </>
    );
  }

  // user logged in
  return (
    <>
      {/* desktop navigation */}
      <div className="hidden items-center md:flex">
        <DesktopNav isUserSignedIn />
      </div>

      {/* mobile navigation */}
      <div className="md:hidden">
        <MoblieNav isUserSignedIn />
      </div>
    </>
  );
}
