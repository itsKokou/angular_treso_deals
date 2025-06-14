import { OperationEnum } from "../enum/operation-enum";

export interface AssetResponse { 
    id?: number;
    userId?: number;
    transactionNumber?: string;
    date?: string;
    nature?: OperationEnum.NatureEnum;
    codeIsin?: string;
    couponRate?: number;
    amount?: number;
    operationSens?: OperationEnum.SensEnum;
    proposedRate?: number;
    valueDate?: string;
    issuerCountry?: string;
    echeanceDate?: string;
    proposedPrice?: number;
    availableAmount?: number;
    createdAt?: string;
    totalNominalValue?: number;
    transactionPrice?: number;
    residualDuration?: number;
    yieldRate?: number;
    totalTransactionValue?: number;
    interet?: number;
    estimatedYield?: number;
    fees?: number;
    proposalCount?: number;

    // propositions?: Array<Proposal>;
    // transactionRate?: number;
    // transactionValue?: number;
    // unitaryValueName?: number;

        
}



