import { JwtPayload, verify } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
interface DecodedJWT extends JwtPayload {
  id: string;
  userType: 'client' | 'freelancer';
}
export function decodeJWT(
  token: string,
  {
    data,
  }: {
    data?: { optional?: boolean; serialize?: boolean };
  },
) {
  if (!token && !data?.optional)
    throw new Error(
      'Authentication Token is required to access this resource.',
    );
  let jwt: DecodedJWT = undefined;
  if (data?.serialize) {
    try {
      jwt = verify(token, SIGN_SECRET) as unknown as DecodedJWT;
      return jwt;
    } catch (err) {
      throw new Error('Invalid or Expired Authentication Token');
    }
  }
  return data?.serialize ? jwt : token;
}
