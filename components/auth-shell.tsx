import Link from "next/link";

/** Split-screen layout shared by signup / forgot-password (mirrors login). */
export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center bg-[#F5F4F2] px-6 py-12 text-neutral-900 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-semibold">Crewboot</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-neutral-600">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a4d] via-[#5b3f6e] to-[#caa089]" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex h-full items-center justify-center px-12">
          <p className="flex flex-wrap items-center justify-center gap-3 text-4xl font-medium text-white">
            Creativity runs on
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-base font-bold">
                C
              </span>
              Crewboot
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
