export class UserModel {
    constructor(
        public DisplayName: string,
        public Email: string,
        public UserType: string,
        public OrganizationId: number
      ) {  }
}