import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
    QueryKey,
    UseQueryOptions,
    useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/config"
import { queryKeysFactory } from "../../lib/query-key-factory"

const USERS_QUERY_KEY = "users" as const
const usersQueryKeys = {
    ...queryKeysFactory(USERS_QUERY_KEY),
    me: () => [USERS_QUERY_KEY, "me"],
}

export const useMe = (
    query?: HttpTypes.AdminUserParams,
    options?: UseQueryOptions<
        HttpTypes.AdminUserResponse,
        FetchError,
        HttpTypes.AdminUserResponse,
        QueryKey
    >
) => {
    const { data, ...rest } = useQuery({
        queryFn: () => sdk.admin.user.me(query),
        queryKey: usersQueryKeys.me(),
        ...options,
    })

    return {
        ...data,
        ...rest,
    }
}