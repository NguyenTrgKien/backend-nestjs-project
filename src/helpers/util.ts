import * as bcrypt from 'bcrypt';

const salftRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, salftRounds);
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = (plainPassword: string, hashPass: string) => {
  try {
    return bcrypt.compareSync(plainPassword, hashPass);
  } catch (error) {
    console.log(error);
  }
};
