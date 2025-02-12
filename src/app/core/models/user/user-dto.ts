import { InstitutionEnum } from "../enum/institution-enum";
import { ProfilUser } from "../enum/profil-user";

export interface UserDto { 
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    institutionId?: number;
    institutionName?: string;
    profile?: ProfilUser.ProfileEnum;
    createdAt?: string;
    status?: InstitutionEnum.Status;
    roles?: string[];
}