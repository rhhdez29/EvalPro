import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ExamSecurityService {
  private isExamActive = false;
  private examId: string | null = null;
  private examVoidedSubject = new Subject<void>();

  public examVoided$ = this.examVoidedSubject.asObservable();
  public isVoided = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  startExamSecurity(examId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.isExamActive = true;
      this.examId = examId;
      this.isVoided = false;

      // Bloquear botón de retroceso forzando un estado en el history
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', this.preventNavigation);

      // Eventos críticos de pérdida de foco
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('blur', this.handleBlur);
    }
  }

  stopExamSecurity() {
    if (isPlatformBrowser(this.platformId)) {
      this.isExamActive = false;
      window.removeEventListener('popstate', this.preventNavigation);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleBlur);
    }
  }

  private preventNavigation = () => {
    if (this.isExamActive) {
      history.pushState(null, '', location.href);
    }
  }

  private handleVisibilityChange = () => {
    if (document.hidden && this.isExamActive && !this.isVoided) {
      this.voidExam('visibilitychange');
    }
  }

  private handleBlur = () => {
    if (this.isExamActive && !this.isVoided) {
      this.voidExam('window_blur');
    }
  }

  private voidExam(trigger: string) {
    this.isVoided = true;
    this.stopExamSecurity();
    this.examVoidedSubject.next();

    // Reporte inmediato al backend
    if (this.examId) {
      this.http.post(`${environment.url_api}/exams/${this.examId}/void/`, {
        reason: 'Abandono de ventana o pestaña',
        triggerEvent: trigger
      }).subscribe({
        error: (err) => console.error('Error reportando anulación', err)
      });
    }
  }
}
