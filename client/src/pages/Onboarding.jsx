import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('todo_onboarded') === '1') {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleStart = () => {
    localStorage.setItem('todo_onboarded', '1');
    navigate('/home', { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="relative flex flex-[1.15] items-center justify-center overflow-hidden bg-primary">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 390 520"
          fill="none"
          aria-hidden
        >
          <path
            d="M-20 80 C40 40, 80 120, 140 90 S240 40, 300 80 S380 140, 420 100"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-30 160 C30 120, 90 200, 150 160 S250 100, 320 150 S400 210, 440 170"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-10 420 C50 380, 100 460, 170 430 S280 360, 340 410 S410 470, 450 430"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 480 C80 450, 130 510, 190 480 S290 420, 350 470"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 mx-auto flex h-40 w-40 items-center justify-center rounded-[32px] bg-white/15 backdrop-blur-sm">
          <div className="flex h-24 w-24 flex-col justify-center gap-2 rounded-2xl bg-white p-4 shadow-lg">
            <div className="h-2.5 w-14 rounded-full bg-primary/80" />
            <div className="h-2.5 w-10 rounded-full bg-primary/40" />
            <div className="mt-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[10px] text-white">✓</span>
              <div className="h-2 w-12 rounded-full bg-[#d9def5]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-10 pt-8">
        <h1 className="text-[28px] font-bold leading-tight text-ink">Manage What To Do</h1>
        <p className="mt-3 max-w-[280px] text-[15px] leading-relaxed text-muted">
          The best way to manage what you have to do, don&apos;t forget your plans.
        </p>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 w-full rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark active:scale-[0.99]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
