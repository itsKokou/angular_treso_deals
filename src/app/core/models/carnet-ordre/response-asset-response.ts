
import { AssetResponse } from './asset-response';


export interface ResponseAssetResponse { 
    statusCode?: number;
    errors?: Array<Error>;
    data?: Array<AssetResponse>;
}

