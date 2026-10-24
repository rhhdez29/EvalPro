import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

/**
 * Servicio de tema (claro / oscuro).
 *
 * - Lee la preferencia guardada en localStorage al iniciar.
 * - toggleDarkMode() alterna la clase `dark` en <html> y persiste la preferencia.
 * - El modo oscuro solo se aplica visualmente en el contexto Profesor/Administrador:
 *   el DashboardLayout llama a setRoleContext() al entrar y clearRoleContext() al salir,
 *   de modo que login, landing y vistas de alumno siempre se muestran en modo claro.
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
  private readonly ALLOWED_ROLES = ['maestro', 'administrador'];

  /** Preferencia del usuario (true = oscuro). */
  readonly isDarkMode = signal<boolean>(false);

  /** Indica si la vista actual pertenece a Profesor/Administrador. */
  private readonly isAllowedContext = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      try {
        this.isDarkMode.set(localStorage.getItem(this.THEME_KEY) === 'dark');
      } catch {
        this.isDarkMode.set(false);
      }
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

  /** Habilita el tema oscuro solo para los roles Profesor/Administrador. */
  setRoleContext(role: string | null | undefined): void {
    this.isAllowedContext.set(!!role && this.ALLOWED_ROLES.includes(role));
    this.syncHtmlClass();
  }

  /** Quita el tema oscuro al salir del layout de Profesor/Administrador. */
  clearRoleContext(): void {
    this.isAllowedContext.set(false);
    this.syncHtmlClass();
  }

  private syncHtmlClass(): void {
    if (!this.isBrowser) return;
    const shouldBeDark = this.isDarkMode() && this.isAllowedContext();
    this.document.documentElement.classList.toggle('dark', shouldBeDark);
  }
}
