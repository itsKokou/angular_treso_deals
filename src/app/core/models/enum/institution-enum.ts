export namespace InstitutionEnum {
    export type Status = 'DELETED' | 'ENABLED' | 'LOCKED';
    export const Status = {
        Deleted: 'DELETED' as Status,
        Enabled: 'ENABLED' as Status,
        Locked: 'LOCKED' as Status
    };

    export type Type = 'BANK' | 'SGI';
    export const Type = {
        Bank: 'BANK' as Type,
        Sgi: 'SGI' as Type
    };
}