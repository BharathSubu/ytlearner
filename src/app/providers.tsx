'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider'; 
import { RecoilRoot } from 'recoil';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
         <RecoilRoot>{children}</RecoilRoot>
      </ThemeProvider> 
  );
};