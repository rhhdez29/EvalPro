import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, KeyRound, ArrowRight, CheckCircle, CircleX, RefreshCw } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { LoadingModalComponent } from '../../../../shared/components/loading-modal/loading-modal.component';
import { OnlyNumbersDirective } from '../../../../shared/directives/only-numbers.directive';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule,
    LoadingModalComponent,
    OnlyNumbersDirective
  ],
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly icons = { Mail, KeyRound, ArrowRight, CheckCircle, CircleX, RefreshCw };

  errorMessage = signal<string | null>(null);
  resendSuccessMessage = signal<string | null>(null);
  isResending = signal<boolean>(false);
  resendCooldown = signal<number>(0);
  private cooldownInterval: any = null;

  modalState = signal<{
    status: 'oculto' | 'cargando' | 'exito' | 'error';
    title: string;
    subtitle: string;
  }>({
    status: 'oculto',
    title: '',
    subtitle: ''
  });

  formVerify: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp_code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    if (emailParam) {
      this.formVerify.patchValue({ email: emailParam });
    }
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  verifyCode(): void {
    this.errorMessage.set(null);
    this.resendSuccessMessage.set(null);

    if (this.formVerify.invalid) {
      this.formVerify.markAllAsTouched();
      return;
    }

    const { email, otp_code } = this.formVerify.getRawValue();

    this.modalState.set({
      status: 'cargando',
      title: 'Verificando código',
      subtitle: 'Comprobando tus datos con el servidor...'
    });

    this.authService.verifyEmail({ email: email.trim(), otp_code: otp_code.trim() }).subscribe({
      next: (response) => {
        this.modalState.set({
          status: 'exito',
          title: '¡Cuenta activada correctamente!',
          subtitle: response.message || 'Tu correo ha sido verificado con éxito. Redirigiendo al inicio de sesión...'
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        const errorMsg =
          err.error?.detail ||
          err.error?.message ||
          err.error?.error ||
          'El código de verificación es inválido o ha expirado. Por favor, inténtalo de nuevo.';

        this.errorMessage.set(errorMsg);

        this.modalState.set({
          status: 'error',
          title: 'Error de verificación',
          subtitle: errorMsg
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 3000);
      }
    });
  }

  resendCode(): void {
    if (this.resendCooldown() > 0 || this.isResending()) {
      return;
    }

    const email = this.formVerify.get('email')?.value?.trim();
    if (!email) {
      this.errorMessage.set('Por favor ingresa un correo electrónico válido para reenviar el código.');
      return;
    }

    this.isResending.set(true);
    this.errorMessage.set(null);
    this.resendSuccessMessage.set(null);

    this.authService.resendOtp({ email }).subscribe({
      next: (response) => {
        this.isResending.set(false);
        const msg = response.message || 'Se ha enviado un nuevo código a tu correo institucional.';
        this.resendSuccessMessage.set(msg);

        this.modalState.set({
          status: 'exito',
          title: 'Código reenviado',
          subtitle: msg
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 2500);

        // Activar cooldown anti-spam de 60 segundos
        this.startCooldown(60);
      },
      error: (err) => {
        this.isResending.set(false);
        const errorMsg =
          err.error?.detail ||
          err.error?.message ||
          err.error?.error ||
          'No se pudo reenviar el código en este momento. Inténtalo más tarde.';

        this.errorMessage.set(errorMsg);

        this.modalState.set({
          status: 'error',
          title: 'Error al reenviar',
          subtitle: errorMsg
        });

        setTimeout(() => {
          this.modalState.set({ status: 'oculto', title: '', subtitle: '' });
        }, 3000);
      }
    });
  }

  private startCooldown(seconds: number): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    this.resendCooldown.set(seconds);
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown.update(current => {
        if (current <= 1) {
          clearInterval(this.cooldownInterval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }
}
