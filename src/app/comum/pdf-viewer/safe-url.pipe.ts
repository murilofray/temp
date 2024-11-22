import { Pipe, PipeTransform, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(@Inject(DomSanitizer) private sanitizer: DomSanitizer) {}

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

