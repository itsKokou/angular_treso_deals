import { OperationEnum } from "../enum/operation-enum";

export interface ResumeAssetResponse {
    transactionNumber: string;
    codeIsin: string;
    operationSens: OperationEnum.SensEnum;
    nature: OperationEnum.NatureEnum;
    echeanceDate: string;
    amount: number;
    valueDate: string;
    date: string;
    couponRate?: number;
    totalNominalValue: number;
    issuerCountry: string;
    residualDuration: number;
    proposedPrice?: number;
    interet?: number;
    estimatedYield?: number;
    yieldRate?: number;
    proposedRate?: number;
    transactionPrice?: number;
    totalTransactionValue?: number;
}



