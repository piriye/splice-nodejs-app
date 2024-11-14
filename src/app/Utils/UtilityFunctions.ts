import * as otpGenerator from 'otp-generator';
import Env from "@ioc:Adonis/Core/Env";

export function generateRandomString(
    numOfChars, 
    digits = true, 
    addHyphenBetweenChars = true,
    upperCaseAlphabets = true, 
    lowerCaseAlphabets = false,
    specialChars = false
): string {
    let options = {};

    if (digits === false) {
        options['digits'] = false
    } else {
        options['digits'] = true
    }

    if (lowerCaseAlphabets === false) {
        options['lowerCaseAlphabets'] = false
    } else {
        options['lowerCaseAlphabets'] = true
    }

    if (upperCaseAlphabets === false) {
        options['upperCaseAlphabets'] = false
    } else {
        options['upperCaseAlphabets'] = true
    }

    if (specialChars === false) {
        options['specialChars'] = false
    } else {
        options['specialChars'] = true
    }

    const otp = otpGenerator.generate(numOfChars, options);

    if (addHyphenBetweenChars) {
        return otp.slice(0,3) + '-' + otp.slice(3, otp.length);
    }

    return otp;
}

export function convertFullNameToEmail(fullName: string, emailDomain?: string) {
    const fullNameArray = fullName.toLowerCase().split(' ');
    return fullNameArray[0] + '.' + fullNameArray[1] + '@' + emailDomain;
}

/**
 * Reference => https://skpaul.me/convert-a-number-to-a-comma-separated-value-or-string-with-decimal-point-in-javascript/
 * Convert number to Comma separated decimal value
 * @param {int} x
 * @param {string} local default value "en-IN"
 * @returns string
 */
export function numberWithCommasAndDecimalPoint(x, local) {
	local = local.length > 0 ? local : "en-IN";
	x = parseFloat(x).toFixed(2);
	var parts = x.toString().split(".");
	parts[0] = parseInt(parts[0]).toLocaleString("en-IN");
    
	return parts.join(".");
}

export function numberWithCommas(numberToConvert) {
    return Number(parseFloat(numberToConvert).toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2
    });
}

export function validateEmail(email: string) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function getLowerDenominationAmount(amount: number, roundUp = false): number {
    if (!amount) {
        return amount;
    }

    if (roundUp) {
        const lowerDenominationValue = amount * 100;
        const roundedValue = Math.ceil(lowerDenominationValue);
        return roundedValue;
    }

    const lowerDenominationValue = amount * 100;
    const roundedValue = Math.round(lowerDenominationValue);

    return roundedValue;
}

export function getHigherDenominationAmount(amount: number): number {
    return Number(amount) / 100;
}

export function isObjEmpty (obj: Object) {
    return Object.keys(obj).length === 0;
}

export function transformMoneyFieldsToHigherDenomination(object) {
    for (const [key, value] of Object.entries(object)) {
        if (value !== null && typeof value === 'object') {
            transformMoneyFieldsToHigherDenomination(value);
        }

        if (
            key.toLowerCase().includes('amount') || 
            key.toLowerCase().includes('price') || 
            key.toLowerCase().includes('earnings') ||
            key.toLowerCase().includes('balance')
        ) {
            object[key] = getHigherDenominationAmount(Number(value));
        }
    }
    
    return object;
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function convertPageParametersToOffset(queryParams, page, pageSize = 20) {
    queryParams['offset'] = Number(page) - 1;
    queryParams['limit'] = Number(pageSize);

    delete queryParams['page'];
    delete queryParams['page_size'];
  
    return queryParams;
}

export function getMerchantBusinessUrl(merchantId: string) {
    return `${Env.get('APP_URL')}/businesses/${merchantId}`;
}

export function generateQRCode(stringToEncode: string) {
    let qrcode = `https://api.qrserver.com/v1/create-qr-code/?data=${stringToEncode}`;
    return qrcode;
}
