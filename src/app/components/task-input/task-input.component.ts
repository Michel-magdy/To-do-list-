import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-input.component.html',
  styleUrl: './task-input.component.css'
})
export class TaskInputComponent {
  private taskService = inject(TaskService);
  taskText = '';

  @ViewChild('inputBar') inputBar!: ElementRef<HTMLDivElement>;
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  addTask(): void {
    const text = this.taskText.trim();
    if (!text) {
      this.taskInput.nativeElement.focus();
      // Shake animation for empty input
      const bar = this.inputBar.nativeElement;
      bar.style.animation = 'none';
      bar.offsetHeight; // trigger reflow
      bar.style.animation = 'shake 0.4s ease';
      setTimeout(() => bar.style.animation = '', 400);
      return;
    }

    this.taskService.addTask(text);
    this.taskText = '';
    this.taskInput.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTask();
    }
  }
}
