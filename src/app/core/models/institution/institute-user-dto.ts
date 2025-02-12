import { InstitutionEnum } from "../enum/institution-enum";

export interface InstituteUserDTO { 
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    fixeNumber?: string;
    job?: string;
    createdAt?: string;
    secondEmail?: string;
    department?: string;
    profile?: string;
    status?: InstitutionEnum.Status;

}



