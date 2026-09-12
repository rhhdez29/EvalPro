import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  isExamFinished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExamGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean {
    return !!component.isExamFinished;
  }
}
