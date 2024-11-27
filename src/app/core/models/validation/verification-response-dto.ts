
import { NexTransition } from '../enum/next-transition';
import { UserDto } from '../user/user-dto';


export interface VerificationResponseDto { 
    user?: UserDto; 
    nexTransition?: NexTransition.NexTransitionEnum;
}



