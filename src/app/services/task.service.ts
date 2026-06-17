import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

export type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'todo-app-tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSignal = signal<Task[]>(this.loadTasks());
  private filterSignal = signal<FilterType>('all');

  // Public computed signals
  readonly tasks = this.tasksSignal.asReadonly();
  readonly currentFilter = this.filterSignal.asReadonly();

  readonly filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const filter = this.filterSignal();
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  });

  readonly totalCount = computed(() => this.tasksSignal().length);
  readonly activeCount = computed(() => this.tasksSignal().filter(t => !t.completed).length);
  readonly completedCount = computed(() => this.tasksSignal().filter(t => t.completed).length);

  private loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  setFilter(filter: FilterType): void {
    this.filterSignal.set(filter);
  }

  addTask(text: string): void {
    const task: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      completed: false,
      createdAt: Date.now()
    };
    this.tasksSignal.update(tasks => [task, ...tasks]);
    this.save();
  }

  toggleTask(id: string): void {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    this.save();
  }

  deleteTask(id: string): void {
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
    this.save();
  }

  editTask(id: string, newText: string): void {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, text: newText } : t)
    );
    this.save();
  }

  clearCompleted(): void {
    this.tasksSignal.update(tasks => tasks.filter(t => !t.completed));
    this.save();
  }
}
