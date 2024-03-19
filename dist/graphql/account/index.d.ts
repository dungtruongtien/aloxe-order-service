declare const _default: {
    resolvers: {
        Query: {
            account(): {
                id: string;
                username: string;
            };
            accounts(): {
                id: number;
                token: string;
            }[];
        };
    };
    typeDefs: import("graphql").DocumentNode;
};
export default _default;
