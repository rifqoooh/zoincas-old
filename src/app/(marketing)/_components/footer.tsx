import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import Link from 'next/link';

const footerNavItem = [
  {
    'Company': [
      { subtitle: 'About us', href: '#about' },
      { subtitle: 'Legal', href: '#legal' },
      { subtitle: 'Security', href: '#security' },
    ],
  },
  {
    'Social Media': [
      { subtitle: 'Github', href: 'github.com' },
      { subtitle: 'Instagram', href: 'instagram.com' },
      { subtitle: 'Twitter', href: 'twitter.com' },
      { subtitle: 'Youtube', href: 'youtube.com' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="pb-16 text-sm leading-6">
      <MaxWidthWrapper>
        <div className="divide-y divide-slate-200">
          <FooterItems />

          <div className="mt-16 pt-10">
            {/* logo */}
            <h4 className="text-2xl font-bold">zoincas.</h4>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export function FooterItems() {
  return (
    <div className="flex">
      {footerNavItem.map((section: object) => (
        <div
          key={Object.keys(section).join('')}
          className="w-1/2 flex-none space-y-10 sm:space-y-8 lg:flex lg:space-y-0"
        >
          {Object.entries(section).map(([sectionTitle, sectionSubtitle]) => (
            <div key={sectionTitle} className="lg:w-1/2 lg:flex-none">
              <h2 className="font-semibold text-slate-900">{sectionTitle}</h2>
              <ul className="mt-3 space-y-2">
                {sectionSubtitle.map(
                  ({ subtitle, href }: { subtitle: string; href: string }) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-slate-900">
                        {subtitle}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
