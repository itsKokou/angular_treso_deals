import { InstitutionEnum } from "../enum/institution-enum";
import { InstituteUserDTO } from "./institute-user-dto";

export interface ResponseInstituteUserDTO { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: Array<InstituteUserDTO>;
}



