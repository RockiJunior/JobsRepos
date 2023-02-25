export class UserLoginResponseDto {
  Id: string;
  Name: string;
  AccessToken: string;

  constructor(Id: string, Name: string, AccessToken: string) {
    this.Id = Id;
    this.Name = Name;
    this.AccessToken = AccessToken;
  }
}
