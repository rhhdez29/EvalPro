import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalPages  = input<number>(1);
  hasNext     = input<boolean>(false);
  hasPrevious = input<boolean>(false);

  pageChange = output<number>();

  goToPrevious(): void {
    if (this.hasPrevious()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  goToNext(): void {
    if (this.hasNext()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
