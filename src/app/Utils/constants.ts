export const USER_TYPES = {
    admin: 'admin',
    customer: 'customer',
    merchant: 'merchant',
    sub_merchant: 'sub-merchant',
};

export const LOGIN_TYPES = {
    email: 'email',
    phone_number: 'phone_number',
};

export const ERROR_CODES = {
    code_invalid: 98761,
    duplicate_key_value: '23505',
    insufficient_funds: 98762,
    invalid_username: 98763,
    invalid_password: 98764,
    payment_requested: 98765,
    paystack_recipient_code_not_generated: 98766,
    row_not_found: 'E_ROW_NOT_FOUND',
    tab_already_paid: 98767,
    tab_exists_status: 98768,
    transaction_pin_not_setup: 98769,
    user_pin_not_setup: 98770,
    validation_error: 'E_VALIDATION_FAILURE',
    wallet_does_not_exist: 98771,
    withdrawal_account_already_exists: 98772,
    withdrawal_account_not_found: 98773,
};

export const VERIFICATION_CODE_DESCRIPTIONS = {
    add_payer: 'add-payer-to-tab',
    open_tab: 'open-tab',
    password_reset: 'password-reset',
    user_email_verification: 'user-email-verification',
    user_phone_number_verification: 'user-phone-number-verification',
}

export const MERCHANT_TYPES = {
    bar: 'Bar',
    hotel: 'Hotel',
    lounge: 'Lounge',
    night_club: 'Night Club',
    recreational_club: 'Recreational Club',
    restaurant: 'Restaurant',
}

export const WITHDRAWAL_ACCOUNT_TYPES = {
    bank: 'bank',
}

export const TAB_STATUSES = {
    abandoned: 'abandoned',
    deleted: 'deleted',
    open: 'open',
    paid: 'paid',
    payment_incomplete: 'payment-incomplete',
    payment_requested: 'payment-requested',
    pending: 'pending',
    running: 'running',
}

export const USER_TODOS = {
    add_withdrawal_account: 'add-withdrawal-account',
    complete_your_business_profile: 'complete-your-business-profile',
    complete_your_kyc: 'complete-your-kyc',
    setup_transaction_pin: 'setup-transaction-pin',
    top_up_your_account: 'top-up-your-account',
    verify_phone_number: 'verify-phone-number',
}

export const WALLET_STATUSES = {
    active: 'active',
    inactive: 'inactive',
    suspended: 'suspended',
}

export const WALLET_TRANSACTION_TYPES = {
    credit: 'credit',
    debit: 'debit'
}

export const TRANSACTION_CHANNELS = {
    paystack: 'paystack',
    flutterwave: 'flutterwave'
}

export const TRANSACTION_SOURCES = {
    bank_transfer: 'bank_transfer',
    card: 'card',
}

export const TRANSACTION_TYPES = {
    inflow: 'inflow',
    outflow: 'outflow',
}

export const TRANSACTION_STATUSES = {
    failed: 'failed',
    pending: 'pending',
    reversed: 'reversed',
    successful: 'successful',
}

export const CUSTOMER_ACTIVITY_TYPES = {
    payment_requested: 'payment-requested',
    tab_closed: 'tab-closed',
    tab_opened: 'tab-opened',
    topup: 'topup',
    withdrawal: 'withdrawal',
    withdrawal_account_added: 'withdrawal-account-added',
}

export const MERCHANT_ACTIVITY_TYPES = {
    items_added_to_menu: 'items-added-to-menu',
    manager_assigned: 'manager-assigned',
    manager_removed: 'manager-removed',
    payment_requested: 'payment-requested',
    sub_merchant_added: 'sub-merchant-added',
    sub_merchant_deleted: 'sub-merchant-deleted',
    tab_closed: 'tab-closed',
    tab_opened: 'tab-opened',
    topup: 'topup',
    withdrawal: 'withdrawal',
}

export const PAYMENT_REQUEST_TYPES = {
    single_payer: 'single-payer',
    split_bill: 'split-bill',
}

export const PAYER_TYPES = {
    non_tab_user: 'non-tab-user',
    tab_user: 'tab-user'
}

export const PAYSTACK_WEBHOOK_EVENTS = {
    pay_bill: 'payment.pay_bill',
    top_up: 'payment.top_up',
}

export const PAYSTACK_TRANSFER_RECIPIENT_TYPES = {
    nuban: 'nuban',
    mobile_money: 'mobile_money'
}

export const CURRENCIES = {
    nigeria: 'NGN'
}

export const TRANSACTION_DESCRIPTIONS = {
    non_tab_user_bill_payment: 'Non tab user bill payment',
    tab_closed_payment: 'Tab closed payment',
    tab_user_bill_payment: 'Tab user bill payment',
    wallet_top_up: 'Wallet top up',
    initiate_bank_transfer: 'Initiate bank transfer'
}

export const DEFAULT_TRANSACTION_FEE = 0.015;

// Lower denomination max transaction fee
export const MAX_TRANSACTION_FEE_AMOUNT = 500000;

export const PAYOUT_STATUSES = {
    failed: 'failed',
    initiated: 'initiated',
    pending: 'pending',
    successful: 'successful',
    suspended: 'suspended',
}

export const DEFAULT_SUB_MERCHANT_NAME = 'Sub-merchant1';

export const GOOGLE_SHEET_COLUMN_DEFINITIONS = {
    item_name: 'Name of the particular product in your menu. E.g. Tomahawk Beef Steak, 50cl Hennessy XO, etc',
    description: 'If your menu item has any extra descriptions, include it in this field',
    price: 'This is the unit cost of the item on your menu list',
    group: 'This is the category that holds all your menu items. \nE.g. Cocktails is a group for menu items like: Sex on the beach, Mohito, Pina Colada, Long Island. \nE.g. Food is a group for menu items like: Chicken wings, Fried rice, etc',
    image_url: 'If you have specific images for your menu items, you can add the image links here. \nAn easy way to achieve this is to upload the images to a google or dropbox drive, make the folder public and then copy each image url and paste it in this field.',
    quantity: 'If the quantity is set to ZERO, the item will be out of stock but still visible in your menu list. \nIt is advised to always check on your quantity field regularly',
}
