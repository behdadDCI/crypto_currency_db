export interface IUser {
  userId:string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  bio: string;
  profile_photo: string;
  canAnalyze: boolean;
  score: number;
  isBlocked: boolean;
  isAdmin: boolean;
  isFollowing: boolean;
  isAccountVerified: boolean;
  viewedBy: [];
  followers: [];
  following: [];
  access_token: string;
  randomVerifyAccountToken: string;
  isPasswordMatched: Function;

}
