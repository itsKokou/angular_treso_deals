import { InstitutionEnum } from "../enum/institution-enum";

export interface Institution { 
    id?: number;
    name?: string;
    type?: InstitutionEnum.Type;
    country?: string;
    city?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    managerFirstName?: string;
    managerLastName?: string;
    managerTitle?: string;
    status?: InstitutionEnum.Status;
    transferLimit?: number;
    transferLimitted?: boolean;
}




