export const typePolicies = {
    Query: {
        fields: {
            exercises: {
                keyArgs: ["filters"],
                merge(existing = [], incoming, { args: { offset = 0 } }) {
                    const merged = existing ? existing.slice(0) : [];
                    for (let i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }
                    return merged;
                }
            },
        },
    },
    Program: {
        fields: {
            days: {
                merge: false 
            }
        }
    }
};