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

// "id": 1001,
//         "name": "BDX Bank",
//         "legalStatus": "BANK",
//         "country": "Sénégal",
//         "city": "Dakar",
//         "address": "Parcelles Assainies U26",
//         "phoneNumber": "775946696",
//         "email": "bdx@bdx.com",
//         "managerFirstName": "Cheikh Ibra",
//         "managerLastName": "YADE",
//         "managerTitle": "Director",
//         "transferLimit": null,
//         "transferLimitted": false



