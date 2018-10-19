export class RegistrationModel {
    constructor(
        public DisplayName: string,
        public Email: string,
        public Password: string,
        public ConfirmPassword: string,
        public OrganizationId: string,
        public OrganizationName: string,
        public OrganizationTypeId: string,
        public IsNewOrganization: boolean
      ) {  }
}
