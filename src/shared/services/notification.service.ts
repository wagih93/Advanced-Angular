import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private toastr: ToastrService,) { }

  showSuccess(message: string, title: string = 'Succés'): void {
    this.toastr.success(message, title);
  }

  showWarning(message: string): void {
    this.toastr.warning(message);
  }

  showError(message: string, title: string = 'Succés'): void {
    this.toastr.error(message, title);
  }

  showStandarError(): void {
    const title = 'Erreur';
    const message = `une erreur s'est produite veuillez réessayer ultérieurement`;
    this.toastr.error(message, title);
  }
}
