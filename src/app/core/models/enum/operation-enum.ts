
export namespace OperationEnum {
    export type SensEnum = 'ACHAT' | 'VENTE';
    export const SensEnum = {
        Achat: 'ACHAT' as SensEnum,
        Vente: 'VENTE' as SensEnum
    };
    export type NatureEnum = 'OAT' | 'BAT';
    export const NatureEnum = {
        Oat: 'OAT' as NatureEnum,
        Bat: 'BAT' as NatureEnum
    };
}