import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggled = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();
  @Output() edited = new EventEmitter<{ id: string; text: string }>();

  isEditing = false;
  editText = '';
  isRemoving = false;

  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  onToggle(): void {
    this.toggled.emit(this.task.id);
  }

  onDelete(): void {
    this.isRemoving = true;
    setTimeout(() => {
      this.deleted.emit(this.task.id);
    }, 300);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editText = this.task.text;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
        this.editInput.nativeElement.select();
      }
    });
  }

  saveEdit(): void {
    const newText = this.editText.trim();
    if (newText && newText !== this.task.text) {
      this.edited.emit({ id: this.task.id, text: newText });
    }
    this.isEditing = false;
  }

  onEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.isEditing = false;
    }
  }
}
