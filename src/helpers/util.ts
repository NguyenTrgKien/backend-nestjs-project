import * as bcrypt from 'bcrypt';

const salftRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, salftRounds);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const comparePassword = async (
  plainPassword: string,
  hashPass: string,
) => {
  try {
    return await bcrypt.compare(plainPassword, hashPass);
  } catch (error) {
    console.log(error);
    return false;
  }
};
