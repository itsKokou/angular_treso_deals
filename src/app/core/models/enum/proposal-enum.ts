export namespace ProposalEnum {
    export type StatusEnum = 'PENDING' | 'ACCEPTED' | 'REJECTED';
    export const StatusEnum = {
        Pending: 'PENDING' as StatusEnum,
        Accepted: 'ACCEPTED' as StatusEnum,
        Rejected: 'REJECTED' as StatusEnum
    };
    export type PublicationStatusEnum = 'PENDING' | 'VALIDATED' | 'CANCELLED';
    export const PublicationStatusEnum = {
        Pending: 'PENDING' as PublicationStatusEnum,
        Validated: 'VALIDATED' as PublicationStatusEnum,
        Cancelled: 'CANCELLED' as PublicationStatusEnum
    };
}