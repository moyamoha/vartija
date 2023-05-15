export const mfaEnabledEmailResp =
  'Your account is now secured by 2-factor authentication. Nicely done :)';

export const mfaDisabledEmailResp = `We detected that you have turned off 2-factor authentication. 
We highly recommend you to turn it back on, since it gives your account extra layer of security :)`;

export const accountDeletedEmailResp =
  'Sad to see you go. Your account was permanently removed :( <br></br>You can always make a new account';

export const accountDeactivedEmailResp = `Your account has been scheduled to be removed in one month from now. 
Once removed you can not recover it or any data of it. If you want to still keep your account simply login again :)`;

export const POSSIBLE_ENTRY_STATUS = ['active', 'expired'] as const;

export const DEFAULT_MFA_SETTINGS = {
  enabled: false,
  userSecret: '',
} as const;
