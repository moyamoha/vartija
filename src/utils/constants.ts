export const mfaEnabledEmailResp =
  'Your account is now secured by 2-factor authentication. Nicely done :)';

export const mfaDisabledEmailResp = `We detected that you have turned off 2-factor authentication. 
We highly recommend you to turn it back on, since it gives your account extra layer of security :)`;

export const accountDeletedEmailResp =
  'Sad to see you go. Your account was permanently removed :( <br></br>You can always make a new account';

export const accountDeactivedEmailResp = `Your account has been scheduled to be removed in one month from now. 
Once removed you can not recover it or any data of it. If you want to still keep your account simply login again :)`;

export const POSSIBLE_ACTIVITY_TYPES = [
  'login',
  'register',
  'delete entry',
  'add entry',
  'edit entry',
  'delete category',
  'add category',
  'edit category',
  'enable 2fa',
  'disable 2fa',
  'change name',
  'change password',
  'deactivate account',
  'reactivate account',
  'delete account',
] as const;

export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  REGISTER: 'register',
  DELETE_ENTRY: 'delete entry',
  ADD_ENTRY: 'add entry',
  EDIT_ENTRY: 'edit entry',
  DELETE_CATEGORY: 'delete category',
  ADD_CATEGORY: 'add category',
  EDIT_CATEGORY: 'edit category',
  ENABLE_2FA: 'enable 2fa',
  DISABLE_2FA: 'disable 2fa',
  CHANGE_NAME: 'change name',
  CHANGE_PASSWORD: 'change password',
  DEACTIVATE_ACCOUNT: 'deactivate account',
  REACTIVATE_ACCOUNT: 'reactivate account',
  DELETE_ACCOUNT: 'delete account',
};

export const POSSIBLE_ENTRY_STATUS = ['active', 'expired'] as const;
