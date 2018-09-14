export class RegistrationModel {
    constructor(
        public displayName: string,
        public email: string,
        public password: string,
        public confirmPassword: string,
        public userType: string
      ) {  }
}
