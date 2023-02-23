
class UserModel {

    UserDetails = {
        name: 'name',
        date_of_birth: 'date_of_birth',
        legal_name: `legal_name`,
        pan: 'pan',
        aadhar: 'aadhar',
        residence: 'residence',
    }

    User = {
        id: 'id',
        phone: 'phone',
        email: 'email',
        password: 'password',
        type: 'type',
        referral_code: 'referral_code',
        referred_by: 'referred_by',
        details: this.UserDetails,
        kyc_status: 'kyc_status',
        deleted: 'deleted',
        created_on: 'created_on',
        updated_on: 'updated_on'
    }

    constructor() {
        if (this.instance) return this.instance
        UserModel.instance = this
    }
}

module.exports = new UserModel();
