export interface SendPasswordResetDTO {
    type: string,
    email?: string,
    phone_number?: string,
}

export interface VerifyPasswordResetDTO {
    type: string,
    email?: string,
    phone_number?: string,
    code: string
}
