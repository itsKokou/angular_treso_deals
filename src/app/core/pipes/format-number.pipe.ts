import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: string | number|null|undefined): string {
    if (value === null || value === undefined) return ''; // Gérer les cas de null ou undefined

    const stringValue = value.toString().replace(/\s+/g, ''); // Éliminer les espaces existants
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajouter un espace tous les 3 caractères
  }

}
