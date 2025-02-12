import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: string | number|null|undefined): string {
    if (value === null || value === undefined) return ''; // Gérer les cas de null ou undefined


    let stringValue = value.toString().replace(/\s+/g, '').replace(",","."); // Supprime les espaces existants et remplacer "," par "."
    let [integerPart, decimalPart] = stringValue.split('.'); // Séparer la partie entière et décimale

    // Ajouter un espace tous les 3 chiffres sur la partie entière seulement
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Retourner la valeur formatée avec la partie décimale si elle existe
    return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;

    // const stringValue = value.toString().replace(/\s+/g, ''); // Éliminer les espaces existants
    // return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajouter un espace tous les 3 caractères
  }

}
