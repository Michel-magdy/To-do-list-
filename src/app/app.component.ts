import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { TaskInputComponent } from './components/task-input/task-input.component';
import { FilterTabsComponent } from './components/filter-tabs/filter-tabs.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { FooterComponent } from './components/footer/footer.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    TaskInputComponent,
    FilterTabsComponent,
    TaskItemComponent,
    EmptyStateComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private taskService = inject(TaskService);

  filteredTasks = this.taskService.filteredTasks;

  onTaskToggled(id: string): void {
    this.taskService.toggleTask(id);
  }

  onTaskDeleted(id: string): void {
    this.taskService.deleteTask(id);
  }

  onTaskEdited(event: { id: string; text: string }): void {
    this.taskService.editTask(event.id, event.text);
  }
}
