import { OperationEnum } from "../enum/operation-enum";
import { Proposal } from "./proposal";

export interface AssetResponse { 
    id?: number;
    transactionNumber?: string;
    codeIsin?: string;
    date?: string;
    propositions?: Array<Proposal>;
    operationSens?: OperationEnum.SensEnum;
    createdAt?: string;
    nature?: OperationEnum.NatureEnum;
    couponRate?: number;
    echeanceDate?: string;
    amount?: number;
    availableAmount?: number;
    price?: number;
    transactionRate?: number;
    interet?: number;
    issuerCountry?: string;
    residualDuration?: number;
    transactionValue?: number;
    unitaryValueName?: number;

    proposedRate?: number;
    proposedPrice?: number;
    valueDate?: string;
    totalNominalValue?: number;
    transactionPrice?: number;
    totalTransactionValue?: number;
    yieldRate?: number;
    estimatedYield?: number;
    feesedPrice?: number;
}



