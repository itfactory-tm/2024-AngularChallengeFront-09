import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLineUpTitle',
  standalone: true
})
export class FormatLineUpTitlePipe implements PipeTransform {
  transform(value: string): string {
   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

   if (dateRegex.test(value)) {
     const [year, month, day] = value.split('-');
     return `${day}/${month}/${year}`;
   }
   
   return value;
  }
}
