import { InstitutionEnum } from "../enum/institution-enum";
import { ProfilUser } from "../enum/profil-user";
import { ProposalEnum } from "../enum/proposal-enum";

export interface ProfilResponse { 
    id?: number;
    institutionEmail?: string;
    institutionName?: string;
    instituteId?: number;
    date?: string;
    status?: ProposalEnum.StatusEnum;
    type?: InstitutionEnum.Type;
    adminName?: string;
    applicant?: string;
}