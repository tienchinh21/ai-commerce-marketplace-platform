import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from './theme.store';
import React from 'react';

describe('useTheme store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('should initialize with default light theme when nothing is stored', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.themeMode).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('should toggle theme from light to dark and save to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('okz_theme_mode')).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('okz_theme_mode')).toBe('light');
  });

  it('should load initial theme from localStorage', () => {
    localStorage.setItem('okz_theme_mode', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.themeMode).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });
});
