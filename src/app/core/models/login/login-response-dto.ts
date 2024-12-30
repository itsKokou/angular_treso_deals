
import { NexTransition } from '../enum/next-transition';
import { VerificationDTO } from './verification-dto';


export interface LoginResponseDTO { 
    nextTransition?: NexTransition.NexTransitionEnum;
    verificationDTO?: VerificationDTO;
    token?: string;
}



