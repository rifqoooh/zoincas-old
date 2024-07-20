import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header className="relative">
      <div className="px-4 pb-10 sm:px-6 md:px-8">
        <div
          className="absolute inset-0 bg-[bottom_1px_center] bg-dot-slate-900/[0.15]"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
          }}
          aria-hidden={'true'}
        />
        <MaxWidthWrapper>
          <div className="relative flex items-center justify-between pt-6 text-sm font-semibold leading-6 text-slate-700 lg:pt-8">
            {/* logo */}
            <h4 className="text-2xl font-bold">zoincas.</h4>

            {/* navigation */}
            <div className="flex items-center">
              <Navigation />
            </div>
          </div>

          <section className="relative mx-auto max-w-5xl pt-20 sm:pt-24 lg:pt-32">
            <h1 className="text-center text-4xl font-extrabold text-slate-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
              Manage your financial together with your people.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-slate-600">
              Invite your loved ones to join you in managing and budgeting your
              finances together. Our app makes it easy and enjoyable to track
              expenses and plan budgets collaboratively!
            </p>
            <div className="mt-6 flex justify-center space-x-6 text-sm sm:mt-10">
              <Link
                href="/dashboard"
                className={cn(buttonVariants(), 'w-full md:w-auto')}
              >
                Enter zoincas.
              </Link>
            </div>
          </section>
        </MaxWidthWrapper>
      </div>
    </header>
  );
}
