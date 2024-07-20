import {
  LayoutDashboardIcon,
  CreditCardIcon,
  Layers2Icon,
  ArrowLeftRightIcon,
  PiggyBankIcon,
  ShoppingBasketIcon,
} from 'lucide-react';

export const navRoutes = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: CreditCardIcon,
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: Layers2Icon,
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRightIcon,
  },
  {
    label: 'Budget Plans',
    href: '/budget-plans',
    icon: PiggyBankIcon,
  },
  {
    label: 'Shopping Plans',
    href: '/shopping-plans',
    icon: ShoppingBasketIcon,
  },
];
