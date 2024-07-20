import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export function DesktopNav({
  isUserSignedIn = false,
}: {
  isUserSignedIn?: boolean;
}) {
  return (
    <nav>
      <ul className="flex items-center gap-x-4">
        {isUserSignedIn ? (
          <>
            {/* enter dashboard */}
            <li>
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: 'sm',
                })}
              >
                Dashboard
              </Link>
            </li>
          </>
        ) : (
          <>
            {/* login */}
            <li>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: 'secondary',
                  size: 'sm',
                })}
              >
                Log in
              </Link>
            </li>

            {/* signup */}
            <li>
              <Link
                href="/signup"
                className={buttonVariants({
                  size: 'sm',
                })}
              >
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
