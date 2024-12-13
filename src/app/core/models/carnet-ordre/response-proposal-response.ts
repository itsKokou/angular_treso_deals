
import { ProposalResponse } from './proposal-response';


export interface ResponseProposalResponse { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: Array<ProposalResponse>;
}

