import { ProposalEnum } from "../enum/proposal-enum";

export interface ProposalResponse { 
    id?: number;
    price?: number;
    amount?: number;
    interet?: number;
    transactionValue?: number;
    status?: ProposalEnum.StatusEnum;
}



