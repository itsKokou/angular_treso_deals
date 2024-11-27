
import { NexTransition } from '../enum/next-transition';
import { InitVerificationDTO } from './init-verification-dto';


export interface LoginResponseDTO { 
    nextTransition?: NexTransition.NexTransitionEnum;
    initVerificationDTO?: InitVerificationDTO;
    token?: string;
}



