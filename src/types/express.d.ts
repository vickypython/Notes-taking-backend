// import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './type';
declare global{
namespace express{
    interface Request{
        user?:IUser
    }
}

}
export {};