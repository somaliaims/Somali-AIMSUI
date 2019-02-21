export class RegistrationModel {
    constructor(
        public Email: string,
        public Password: string,
        public ConfirmPassword: string,
        public OrganizationId: string,
        public OrganizationName: string,
        public OrganizationTypeId: string,
        public IsNewOrganization: boolean
      ) {  }
}
