export interface LoginResponse{
    fullName: string,
    token?: {
        token: string
    },
    accessToken?: string,
    role_id: number
}

export interface typeResponse{
    name: string,
}

