import { DateTime } from "luxon";
import { generateRandomString } from "App/Utils/UtilityFunctions";
import BadRequestException from "App/Exceptions/BadRequestException";
import BaseService from "./BaseService";
import VerificationCode from "App/Models/VerificationCode";

class VerificationCodeService extends BaseService {
    constructor() {
        super(VerificationCode.query());
    }

    public async create(
        verificationType: string, 
        description: string, 
        sentTo: string | undefined,
        reference: string
    ) {
        if (sentTo === undefined) {
            throw new BadRequestException('Sent to parameter cannot be undefined');
        }

        const query = { 
            where: `reference:${reference},sent_to:${sentTo},verification_type:${verificationType},description:${description}`,
            where_null: 'deleted_at'
        };
        const verificationCode = await this.executeQuery(query, true);

        if (verificationCode) {
            return verificationCode;
        }

        const code = generateRandomString(4, true, false, false);

        const verificationCodeData = {
            verificationType,
            description,
            code,
            sentTo,
            reference
        };

        const verificationCodeEntry = await VerificationCode.create(verificationCodeData);
        
        return verificationCodeEntry;
    }

    // TODO: add description to this function and use to fetch entry
    public async verifyCode(reference: string, sentTo: string, code: string) {
        const query = { 
            where: `reference:${reference},sent_to:${sentTo}`,
            where_null: 'deleted_at'
        };
        const verificationCodeEntry = await this.executeQuery(query, true);
        
        if (verificationCodeEntry && code === verificationCodeEntry.code) {
            await verificationCodeEntry
                .merge({ 
                    isVerified: true,
                    deletedAt: DateTime.now()
                })
                .save();

            return true;
        }

        return false;
    }
}

export default VerificationCodeService;