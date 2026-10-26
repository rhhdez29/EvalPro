import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

/**
 * Servicio de tema (claro / oscuro).
 *
 * - Lee la preferencia guardada en localStorage al iniciar.
 * - toggleDarkMode() alterna la clase `dark` en <html> y persiste la preferencia.
 * - Mantiene el tema consistente en toda la plataforma (Landing, Demo Exam, Autenticación y Dashboard).
 * - Todo acceso a localStorage / document está protegido para SSR.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly THEME_KEY = 'evalpro-theme';

  /** Preferencia del usuario (true = oscuro). */
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem(this.THEME_KEY);
        this.isDarkMode.set(saved === 'dark');
      } catch {
        this.isDarkMode.set(false);
      }
      this.syncHtmlClass();
    }
  }

  /** Alterna el modo oscuro, guarda la preferencia y actualiza la clase en <html>. */
  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  setDarkMode(enabled: boolean): void {
    this.isDarkMode.set(enabled);
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.THEME_KEY, enabled ? 'dark' : 'light');
      } catch {
        /* localStorage no disponible (modo privado, etc.) */
      }
    }
    this.syncHtmlClass();
  }

  /** Métodos de compatibilidad con layouts: mantienen sincronizada la preferencia del usuario */
  setRoleContext(_role?: string | null): void {
    this.syncHtmlClass();
  }

  clearRoleContext(): void {
    this.syncHtmlClass();
  }

  setLandingContext(_active?: boolean): void {
    this.syncHtmlClass();
  }

  private syncHtmlClass(): void {
    if (!this.isBrowser) return;
    this.document.documentElement.classList.toggle('dark', this.isDarkMode());
  }
}
