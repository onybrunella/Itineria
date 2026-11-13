import { ApplicationRef, Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  text = signal<string | null>(null);
  kind = signal<'success' | 'error'>('success');
  private app = inject(ApplicationRef);
  private timer: ReturnType<typeof setTimeout> | null = null;

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }

  dismiss() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.text.set(null);
    this.app.tick();
  }

  private show(text: string, kind: 'success' | 'error') {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.kind.set(kind);
    this.text.set(text);
    this.app.tick();
    this.timer = setTimeout(() => {
      this.text.set(null);
      this.app.tick();
    }, 3000);
  }
}
