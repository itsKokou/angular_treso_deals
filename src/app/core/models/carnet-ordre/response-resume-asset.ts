
import { ProposalResponse } from './proposal-response';
import { ResumeAssetResponse } from './resume-asset-response';


export interface ResponseResumeAsset { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: ResumeAssetResponse;
}

