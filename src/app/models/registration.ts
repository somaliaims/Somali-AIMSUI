export class RegistrationModel {
    constructor(
        public email: string,
        public password: string,
        public confirmPassword: string,
        public organizationId: string,
        public organizationName: string,
        public organizationTypeId: string,
        public isNewOrganization: boolean
      ) {  }
}
