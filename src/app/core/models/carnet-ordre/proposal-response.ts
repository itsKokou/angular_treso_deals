import { OperationEnum } from "../enum/operation-enum";
import { ProposalEnum } from "../enum/proposal-enum";

export interface ProposalResponse { 
    id?: number;
    assetId?: number;
    transactionPrice?: number;
    transactionRate?: number;
    amount?: number;
    interet?: number;
    transactionValue?: number;
    status?: ProposalEnum.StatusEnum;
    date?: string,
    nature?: OperationEnum.NatureEnum;
    sens?: OperationEnum.SensEnum;
    yield?: number;
    totalNominalValue?: number;
}



