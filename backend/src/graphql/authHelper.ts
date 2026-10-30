import { GraphQLError } from 'graphql';
import type { GraphQLContext } from '../../types/GraphQLContext';
import type { UserJWT } from '../../types/auths';


export function requireAuth(context: GraphQLContext): UserJWT {
    if (!context.userJWT) {
        throw new GraphQLError('You must be logged in', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    return context.userJWT;
}