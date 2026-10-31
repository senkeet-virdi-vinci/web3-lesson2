import type { GraphQLContext } from '../../types/GraphQLContext';
import type { UserJWT } from '../../types/auths';
import { AuthenticationError } from '../errors/app.error.ts';


export function requireAuth(context: GraphQLContext): UserJWT {
    if (!context.userJWT) {
        throw new AuthenticationError('You must be logged in to perform this action');
    }
    return context.userJWT;
}