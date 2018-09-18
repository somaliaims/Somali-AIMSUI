export class RegistrationModel {
    constructor(
        public DisplayName: string,
        public Email: string,
        public Password: string,
        public ConfirmPassword: string,
        public UserType: string
      ) {  }
}
