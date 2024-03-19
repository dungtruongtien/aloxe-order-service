declare const _default: {
    resolvers: {
        Query: {
            me(): {
                id: string;
                username: string;
            };
            users(): {
                id: number;
                username: string;
            }[];
        };
    };
    typeDefs: import("graphql").DocumentNode;
};
export default _default;
