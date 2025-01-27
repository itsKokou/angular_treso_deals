import { ProfilUser } from "../enum/profil-user";

export interface UserInstitut { 
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    institutionId?: number;
    institutionName?: string;
    profile?: ProfilUser.ProfileEnum;
    createdAt?: string
}