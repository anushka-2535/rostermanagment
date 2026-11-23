import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

interface HomePageProps {
  onSignIn: () => void;
}

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Build better rosters',
    description: 'Plan shifts around availability, skills, and coverage needs in one clear view.',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Users,
    title: 'Keep every team in sync',
    description: 'Give admins, pod leads, and employees the tools that fit the way they work.',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    icon: ShieldCheck,
    title: 'Catch gaps before they happen',
    description: 'Spot conflicts early and make confident adjustments before publishing.',
    color: 'bg-amber-100 text-amber-700',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onSignIn }) => (
  <div className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-8 sm:py-4 lg:px-12">
      <a href="#" className="flex items-center gap-2.5" aria-label="RosterFlow home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <CalendarDays className="h-5 w-5" />
        </span>
        <span className="text-lg font-extrabold tracking-tight">RosterFlow</span>
      </a>

      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
        <a href="#features" className="transition hover:text-indigo-600">Features</a>
        <a href="#how-it-works" className="transition hover:text-indigo-600">How it works</a>
        <a href="#teams" className="transition hover:text-indigo-600">For your team</a>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:gap-2 sm:px-4"
        >
          Sign in <ArrowRight className="hidden h-4 w-4 sm:block" />
        </button>
      </div>
      </div>
    </header>

    <main>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative z-[1]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Workforce planning, made clearer
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.7rem]">
            Great teams start with a
            <span className="text-indigo-600"> better roster.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Bring shifts, people, and coverage together. RosterFlow helps your team plan
            work confidently and keep everyone on the same page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Sign in to your workspace <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Explore features <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> One shared team view</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Smarter shift coverage</span>
          </div>
        </div>

        <div className="relative z-[1] mx-auto w-full max-w-[610px]">
          <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="relative rounded-[1.75rem] border border-white bg-white p-3 shadow-[0_30px_90px_-35px_rgba(37,49,100,0.38)] sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Team schedule</p>
                <p className="mt-1 text-[11px] text-slate-500">A clearer view of the week ahead</p>
              </div>
              <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700">This week</div>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_repeat(5,minmax(0,1fr))] gap-1.5 text-center text-[10px] sm:gap-2">
              <div />
              {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, index) => (
                <div key={day} className={`pb-2 font-bold ${index === 2 ? 'text-indigo-700' : 'text-slate-400'}`}>
                  <span>{day}</span>
                  <span className={`mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${index === 2 ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                    {12 + index}
                  </span>
                </div>
              ))}

              {[
                { name: 'Customer care', initials: 'CC', shifts: ['bg-indigo-100', 'bg-indigo-100', 'bg-indigo-100', 'bg-indigo-100', 'bg-indigo-100'] },
                { name: 'Pod Alpha', initials: 'PA', shifts: ['bg-teal-100', 'bg-teal-100', 'bg-amber-100', 'bg-teal-100', 'bg-teal-100'] },
                { name: 'Pod Beta', initials: 'PB', shifts: ['bg-violet-100', 'bg-violet-100', 'bg-violet-100', 'bg-slate-100', 'bg-violet-100'] },
                { name: 'Operations', initials: 'OP', shifts: ['bg-amber-100', 'bg-amber-100', 'bg-amber-100', 'bg-amber-100', 'bg-slate-100'] },
              ].map((team) => (
                <React.Fragment key={team.name}>
                  <div className="flex items-center gap-1.5 py-2 text-left sm:gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[8px] font-bold text-slate-500">{team.initials}</span>
                    <span className="hidden truncate font-semibold text-slate-600 sm:inline">{team.name}</span>
                  </div>
                  {team.shifts.map((shift, index) => (
                    <div key={`${team.name}-${index}`} className="py-2">
                      <div className={`h-9 rounded-lg ${shift} ${index === 2 && team.name === 'Pod Alpha' ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`} />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm"><Clock3 className="h-3.5 w-3.5" /></span>
                Coverage at a glance
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All shifts covered
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-1 flex items-center gap-2.5 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:-right-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Check className="h-5 w-5" /></span>
            <span><span className="block text-xs font-bold text-slate-900">Roster ready</span><span className="mt-0.5 block text-[10px] text-slate-500">Your team is in sync</span></span>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-slate-100 bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Everything in one place</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Make workforce planning feel simple.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">Less time untangling schedules. More time helping your people do their best work.</p>
          </div>
          <div id="how-it-works" className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <article key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="teams" className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row lg:px-12">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Ready to get your team in sync?</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in to open your RosterFlow workspace.</p>
        </div>
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Go to sign in <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </main>

    <footer className="border-t border-slate-200/70 bg-white px-5 py-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
        <span className="font-bold text-slate-700">RosterFlow</span>
        <span>Workforce operations, thoughtfully organized.</span>
      </div>
    </footer>
  </div>
);
