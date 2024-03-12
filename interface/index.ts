export interface IUser {
  userId: string;
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
  createAccountVerificationToken: Function;
  accountVerificationToken: string;
  accountVerificationTokenExpires: Date;
}

export interface ICoin {
  _id: string;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: Number;
  market_cap: Number;
  market_cap_rank: Number;
  fully_diluted_valuation: Number;
  total_volume: Number;
  high_24h: Number;
  low_24h: Number;
  price_change_24h: Number;
  price_change_percentage_24h: Number;
  market_cap_change_24h: Number;
  market_cap_change_percentage_24h: Number;
  circulating_supply: Number;
  total_supply: Number;
  max_supply: Number;
  ath: Number;
  ath_change_percentage: Number;
  ath_date: Date;
  atl_date: Number;
  atl_change_percentage: Date;
  roi: Object;
  last_updated: Date;
}
