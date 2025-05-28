import { OperationEnum } from "../enum/operation-enum";
import { ProposalEnum } from "../enum/proposal-enum";

export interface ProposalResponse { 
    id?: number;
    assetId?: number;
    price?: number;
    transactionPrice?: number;
    amount?: number;
    interet?: number;
    transactionValue?: number;
    status?: ProposalEnum.StatusEnum;
    date?: string,
    nature?: OperationEnum.NatureEnum;
}



