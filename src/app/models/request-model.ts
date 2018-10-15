export class RequestModel {
    constructor(
        public requestNo : number,
        public errorStatus: number,
        public errorMessage: string
    ) {}
}