export class RegistrationModel {
    constructor(
        public DisplayName: string,
        public Email: string,
        public Password: string,
        public ConfirmPassword: string,
        public UserType: string,
        public OrganizationId: string,
        public Organization: string,
        public OrganizationTypeId: string,
        public IsNewOrganization: boolean
      ) {  }
}
