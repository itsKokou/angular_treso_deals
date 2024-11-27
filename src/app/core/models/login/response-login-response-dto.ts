
import { LoginResponseDTO } from './login-response-dto';


export interface ResponseLoginResponseDTO { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: LoginResponseDTO;
}

