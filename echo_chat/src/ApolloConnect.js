import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client'
import { userData } from "./helper"
const { jwt } = userData()

const token = jwt

const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        }
    })

    return forward(operation)
})

const httpLink = new HttpLink({ uri: 'https://genuine-confidence-10f0398c7f.strapiapp.com/graphql' })
const link = ApolloLink.from([authLink, httpLink])
const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})

export default client