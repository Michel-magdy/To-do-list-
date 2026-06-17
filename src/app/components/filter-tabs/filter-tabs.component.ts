import { Component, inject } from '@angular/core';
import { TaskService, FilterType } from '../../services/task.service';

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  templateUrl: './filter-tabs.component.html',
  styleUrl: './filter-tabs.component.css'
})
export class FilterTabsComponent {
  private taskService = inject(TaskService);
  currentFilter = this.taskService.currentFilter;

  filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  setFilter(filter: FilterType): void {
    this.taskService.setFilter(filter);
  }
}
