import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private taskService = inject(TaskService);

  activeCount = this.taskService.activeCount;
  completedCount = this.taskService.completedCount;
  totalCount = this.taskService.totalCount;

  clearCompleted(): void {
    this.taskService.clearCompleted();
  }
}
