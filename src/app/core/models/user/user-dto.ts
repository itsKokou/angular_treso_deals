import { ProfilUser } from "../enum/profil-user";

export interface UserDto { 
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    institutionId?: number;
    profile?: ProfilUser.ProfileEnum;
}