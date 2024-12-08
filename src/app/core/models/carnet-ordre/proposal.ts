import { ProposalEnum } from "../enum/proposal-enum";

export interface Proposal { 
    id?: number;
    // asset?: Asset;
    userId?: number;
    price?: number;
    amount?: number;
    interet?: number;
    transactionValue?: number;
    status?: ProposalEnum.StatusEnum;
    publicationStatus?: ProposalEnum.PublicationStatusEnum;
}



