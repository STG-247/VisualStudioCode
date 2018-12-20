import { RelationLinkInterface } from './relationLink.interface';
export interface DataNodeInterface {
    id: string;
    links?: Array<RelationLinkInterface>;
    data?: any;
}
