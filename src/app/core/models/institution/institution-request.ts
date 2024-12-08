import { InstitutionEnum } from "../enum/institution-enum";

export interface InstitutionRequest { 
    id?: number;
    name: string;
    juridicStatus: InstitutionEnum.Type;
    country: string;
    city: string;
    address: string;
    phoneNumber: string;
    email: string;
    managerFirstName: string;
    managerLastName: string;
    managerTitle: string;
}



