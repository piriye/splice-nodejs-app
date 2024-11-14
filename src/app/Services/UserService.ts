import { MerchantDTO, UserDTO } from "App/Interfaces/DTOs/UserInterfaces";
import { 
    CUSTOMER_ACTIVITY_TYPES, 
    ERROR_CODES, 
    LOGIN_TYPES, 
    PAYSTACK_TRANSFER_RECIPIENT_TYPES, 
    TRANSACTION_CHANNELS, 
    TRANSACTION_DESCRIPTIONS, 
    TRANSACTION_SOURCES, 
    TRANSACTION_STATUSES, 
    TRANSACTION_TYPES, 
    USER_TODOS, 
    USER_TYPES, 
    VERIFICATION_CODE_DESCRIPTIONS, 
    WITHDRAWAL_ACCOUNT_TYPES 
} from "App/Utils/constants";
import ActivityService from "./ActivityService";
import BadRequestException from "App/Exceptions/BadRequestException";
import BaseService from "./BaseService";
import CardDetail from "App/Models/CardDetail";
import Hash from '@ioc:Adonis/Core/Hash';
import MailService from "./MailService";
import MerchantService from "./MerchantService";
import NotFoundException from "App/Exceptions/NotFoundException";
import PaystackService from "./PaystackService";
import TransactionService from "./TransactionService";
import User from "App/Models/User";
import VerificationCodeService from "./VerificationCodeService";
import WalletService from "./WalletService";
import WithdrawalAccount from "App/Models/WithdrawalAccount";

class UserService extends BaseService {
    public verificationCodeService: VerificationCodeService;
    public mailService: MailService;
    public merchantService: MerchantService;
    public paystackService: PaystackService;
    public walletService: WalletService;

    constructor() {
        super(User.query());

        this.mailService = new MailService();
        this.merchantService = new MerchantService();
        this.paystackService = new PaystackService();
        this.verificationCodeService = new VerificationCodeService();
        this.walletService = new WalletService();
    }

    public async create(userData: UserDTO | any, sendEmailVerification = true) {
        let response = {};
        let userType: string = userData.type;

        const username = (userData.type === USER_TYPES.merchant) ?
            await this.generateUsername(userData.business_name) : await this.generateUsername(userData.full_name);

        const userDetails = {
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            type: userData.type,
            email: userData.email,
            password: userData.password,
            username
        };
        const user = await User.create(userDetails);
        response['user'] = user;

        if (userData.type === USER_TYPES.merchant) {
            const merchantData: MerchantDTO = {
                name: userData.business_name,
                phone_number: userData.phone_number,
                email: userData.email,
                user_id: user.id,
            };

            const merchant = await this.merchantService.create(merchantData);
            response['merchant'] = merchant;
        }

        if (sendEmailVerification) {
            this.sendEmailVerification(user, userType);
        }

        await this.walletService.create(userType, user.id);
        return response;
    }

    public async createNonTabUser(userIdentifier: string, userIdentifierType: string) {
        let userDetails;
        if (userIdentifierType == LOGIN_TYPES.email) {
            userDetails = { email: userIdentifier };
        } else {
            userDetails = { phone_number: userIdentifier };
        }

        userDetails.type = USER_TYPES.customer;
        userDetails.fullName = userIdentifier;
        const user = await User.create(userDetails);
        
        return user;
    }

    public async generateUsername(stringToGenerateFrom) {
        const username = await stringToGenerateFrom.replace(/\s+/g, '').toLowerCase();
        const query = { where_like: `username:${username}` };

        const results = await this.executeQuery(query);
        if (results.length > 0) {
            return `${username}${results.length}`;
        }
        
        return username;
    }

    public async sendEmailVerification(user: User, userType: string) {
        const verificationCodeEntry = await this.verificationCodeService
            .create(
                LOGIN_TYPES.email,
                VERIFICATION_CODE_DESCRIPTIONS.user_email_verification,
                user.email,
                user.id,
            );

        let mailData = {
            customer_type: userType,
            user_name: user.fullName,
            otp: verificationCodeEntry.code
        };

        this.mailService.sendMail(
            'noreply@' + process.env.MAIL_DOMAIN,
            user.email,
            'Welcome to Tab',
            mailData,
            'emails/email-verification'
        );
    }

    public async resendEmailVerification(userId: string) {
        const user = await this.getById(userId);

        const verificationCodeEntry = await this.verificationCodeService
            .create(
                LOGIN_TYPES.email,
                VERIFICATION_CODE_DESCRIPTIONS.user_email_verification,
                user.email,
                user.id,
            );

        let mailData = {
            customer_type: user.type,
            user_name: user.fullName,
            otp: verificationCodeEntry.code
        };

        this.mailService.sendMail(
            'noreply@' + process.env.MAIL_DOMAIN,
            user.email,
            'Welcome to Tab',
            mailData,
            'emails/email-verification'
        );
    }

    public async verifyEmail(auth, userId: string, code: string) {
        const user = await this.getById(userId);
        const isEmailVerified = await this.verificationCodeService
            .verifyCode(
                userId,
                user.email,
                code
            );

        if (isEmailVerified) {
            this.updateUser(userId, { emailVerified: true });
            const token = await auth.use('api').login(user);

            return {
                is_email_verified: true,
                token
            };
        }

        throw new BadRequestException('Verification code invalid', ERROR_CODES.code_invalid);
    }

    public async addWithdrawalAccount(userId: string, withdrawalAccountData) {
        const doesAccountExist = await WithdrawalAccount.findBy('user_id', userId);

        if (doesAccountExist) {
            throw new BadRequestException('Withdrawal account already exists', 
                ERROR_CODES.withdrawal_account_already_exists);
        }

        let withdrawalAccountDetails = {};

        withdrawalAccountDetails['user_id'] = userId;
        withdrawalAccountDetails['account_type'] = withdrawalAccountData['account_type'];

        if (withdrawalAccountData.account_type === WITHDRAWAL_ACCOUNT_TYPES.bank) {
            withdrawalAccountDetails['account_details'] = {
                bank_name: withdrawalAccountData.bank_name,
                bank_code: withdrawalAccountData.bank_code,
                account_name: withdrawalAccountData.account_name,
                account_number: withdrawalAccountData.account_number
            }
        }

        const withdrawalAccount = await WithdrawalAccount.create(withdrawalAccountDetails);

        this.createTransferRecipientForWithdrawalAccount(withdrawalAccount);

        const activityData = {
            user_id: userId,
            title: 'Withdrawal account added',
            subtext: '',
            type: CUSTOMER_ACTIVITY_TYPES.withdrawal_account_added
        };
        ActivityService.create(activityData);

        return withdrawalAccount;
    }

    public async createTransferRecipientForWithdrawalAccount(withdrawalAccount) {
        const transferRecipientResponse = await this.paystackService.createTransferRecipient(
            PAYSTACK_TRANSFER_RECIPIENT_TYPES.nuban, 
            withdrawalAccount.accountDetails
        );

        let accountDetails = withdrawalAccount.accountDetails;
        accountDetails['paystack_recipient_code'] = transferRecipientResponse.data['recipient_code'];

        await withdrawalAccount
            .merge({ account_details: accountDetails })
            .save();
    }

    public async getWithdrawalAccount(userId: string) {
        const withdrawalAccount = await WithdrawalAccount.findByOrFail('user_id', userId);
        return withdrawalAccount;
    }

    public async getUser(queryParams): Promise<User> {
        const user = await this.executeQuery(queryParams);
        return user[0];
    }

    public async getUsers(queryParams): Promise<User[]> {
        const users = await this.executeQuery(queryParams);
        return users;
    }

    public async getById(userId: string): Promise<User> {
        const user = await User.findOrFail(userId);
        return user;
    }

    public async updateUser(userId: string, userData) {
        const user = await this.getById(userId);
        await user
            .merge(userData)
            .save();

        return user;
    }

    public async getUserToDos(userId) {
        let toDos: string[] = [];

        const user = await this.getById(userId);
        const withdrawalAccount = await WithdrawalAccount.findBy('user_id', userId);

        if (withdrawalAccount == null) {
            toDos.push(USER_TODOS.add_withdrawal_account);
        }

        if (user.pin == null) {
            toDos.push(USER_TODOS.setup_transaction_pin);
        }

        if (user.type === USER_TYPES.customer) {
            const wallet = await this.walletService.getByUserId(userId);

            if (Number(wallet.balance) === 0) {
                toDos.push(USER_TODOS.top_up_your_account);
            }
        }

        return toDos;
    }

    public async validateUserPin(user, pin): Promise<boolean> {
        if (user.pin == null) {
            throw new BadRequestException('User pin not setup', 
                ERROR_CODES.user_pin_not_setup);
        }

        return await Hash.verify(user.pin, pin);
    }

    public async validateTransactionPin(user, pin): Promise<boolean> {
        if (user.transactionPin == null || user.transactionPin == '') {
            throw new BadRequestException('Transaction pin not setup', 
                ERROR_CODES.transaction_pin_not_setup);
        }

        return await Hash.verify(user.transactionPin, pin);
    }

    public async changePassword(user: User, changePasswordData) {
        if (!(await Hash.verify(user.password, changePasswordData.current_password))) {
            throw new BadRequestException('Invalid password', 
                ERROR_CODES.invalid_password);
        }

        const newPasswordEntry = { password: changePasswordData.new_password };
        await this.updateUser(user.id, newPasswordEntry);
    }

    public async saveCard(userId: string, cardData) {
        let saveCardDetails = {};

        saveCardDetails['user_id'] = userId;
        saveCardDetails['authorization_provider'] = cardData.authorization_provider;

        let last4Digits;
        if (cardData.authorization_provider === TRANSACTION_CHANNELS.paystack) {
            saveCardDetails['authorization'] = {
                email: cardData.email,
                authorization_details: cardData.authorization
            }
            last4Digits = cardData.authorization.last4;
        }

        const cardDetail = await CardDetail.create(saveCardDetails);

        const activityData = {
            user_id: userId,
            title: `Added debit card ending in ${last4Digits}`,
            subtext: '',
            type: CUSTOMER_ACTIVITY_TYPES.topup
        };
        ActivityService.create(activityData);

        return cardDetail;
    }

    public async getCards(userId: string) {
        const cardDetails = await CardDetail
            .query()
            .where('user_id', userId)
            .exec();

        const cardDetailsResponse = cardDetails.map((cardDetail) => {
            let response = {};
            if (cardDetail.authorizationProvider == TRANSACTION_CHANNELS.paystack) {
                response['id'] = cardDetail.id;
                response['exp_year'] = cardDetail.authorization['authorization_details']['exp_year'];
                response['exp_month'] = cardDetail.authorization['authorization_details']['exp_month'];
                response['card_type'] = cardDetail.authorization['authorization_details']['card_type'];
                response['last4'] = cardDetail.authorization['authorization_details']['last4'];
            }

            return response;
        })

        return cardDetailsResponse;
    }

    public async initiateWithdrawal(userId: string, amountToWithdraw: number) {
        const wallet = await this.walletService.getByUserId(userId);

        if (wallet.balance < amountToWithdraw) {
            throw new BadRequestException('Insufficient funds', ERROR_CODES.insufficient_funds);
        }

        const withdrawalAccount = await this.getWithdrawalAccount(userId);

        if (!withdrawalAccount) {
            throw new NotFoundException('User does not have withdrawal account', 
                ERROR_CODES.withdrawal_account_not_found);
        }

        if (!withdrawalAccount.accountDetails['paystack_recipient_code']) {
            throw new BadRequestException('Unable to initiate withdrawal, please contact support', 
                ERROR_CODES.paystack_recipient_code_not_generated);
        }

        const transaction = await TransactionService.logTransaction({
            amount: amountToWithdraw,
            channel: TRANSACTION_CHANNELS.paystack,
            description: TRANSACTION_DESCRIPTIONS.initiate_bank_transfer,
            source: TRANSACTION_SOURCES.bank_transfer,
            status: TRANSACTION_STATUSES.pending,
            type: TRANSACTION_TYPES.outflow,
            user_reference_type: 'user',
            user_reference: userId,
        });

        await this.paystackService.initiateTransfer(
            amountToWithdraw, 
            transaction.id, 
            withdrawalAccount.accountDetails['paystack_recipient_code'], 
            'Withdraw funds from wallet'
        );
    }
}

export default UserService;
