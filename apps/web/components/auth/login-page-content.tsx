'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { LoginShowcase } from '@/components/auth/login-showcase';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export function LoginPageContent() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
      <LoginShowcase />
      <div className="flex items-center justify-center px-4 py-10 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[420px] items-center justify-center">
              <LoadingSpinner className="h-8 w-8" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
