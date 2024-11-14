export interface UserDTO {
    full_name: string,
    phone_number: string,
    type: string,
    email: string,
    password: string,
    business_name?: string,
}

export interface MerchantDTO {
    name: string,
    phone_number: string,
    email: string,
    user_id: string,
}
