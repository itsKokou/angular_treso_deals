import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return ''; // Gérer les valeurs nulles ou invalides
    }
    let plainString = value.toString().replace(',','.')
    let numericValue = parseFloat(plainString.replace(/\s+/g, '')); // Convertir en nombre
    let formattedValue = numericValue.toFixed(4); // Fixer à 4 décimales
    
    if (value === null || value === undefined || isNaN(Number(formattedValue))) {
      return ''; // Gérer les valeurs nulles ou invalides
    }
    
    return `${formattedValue} %`; // Ajouter le symbole %
  }

}
