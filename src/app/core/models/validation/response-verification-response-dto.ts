
import { NexTransition } from '../enum/next-transition';
import { UserDto } from '../user/user-dto';
import { VerificationResponseDto } from './verification-response-dto';


export interface ResponseVerificationResponseDto { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: VerificationResponseDto
}



