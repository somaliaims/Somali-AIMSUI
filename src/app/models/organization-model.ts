export class Organization {
    constructor(public id: number, public organizationName: string) {}
  }
  
  export interface IOrganization {
    total: number;
    results: Organization[];
  }