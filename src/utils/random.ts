import { UserDocument } from 'src/schemas/user.schema';

export const randomPass = () => {
  return (Math.random() + 1).toString(36).substring(2);
};

export const getProfileUpdateEventPayload = (user: UserDocument) => {
  return {
    isActive: user.isActive,
    profile: {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mfaEnabled: user.mfa.enabled,
    },
  };
};
