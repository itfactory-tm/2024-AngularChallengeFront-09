import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLineUpTitle',
  standalone: true
})
export class FormatLineUpTitlePipe implements PipeTransform {
  transform(value: string): string {
   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

   if (dateRegex.test(value)) {
    let betterDate: Date = new Date(value);
    return `${betterDate.toLocaleString('en-GB', { weekday: 'short' })}`
   }
   
   return value;
  }
}
