import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface VerifyEmailRequest {
  email: string;
  otp_code: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface AuthResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.url_api;

  public verifyEmail(payload: VerifyEmailRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/verify-email/`, payload);
  }

  public resendOtp(payload: ResendOtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/resend-otp/`, payload);
  }
}
