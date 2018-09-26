/* eslint-disable no-news */
import bcrypt from 'bcrypt-nodejs';

class CryptData {
  static encryptData(dataToEncrypt) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (salt) => {
        bcrypt.hash(dataToEncrypt, salt, null, (err, encryptedData) => {
          if (err) {
            reject(Error('An error occurred while hashing'));
          }
          if (encryptedData) resolve(encryptedData);
        });
      });
    });
  }

  static decryptData(dataToDecrypt, dataBaseHash) {
    return new Promise((resolve) => {
      const result = bcrypt.compareSync(dataToDecrypt, dataBaseHash);
      if (result !== undefined) resolve(result);
    });
  }
}
export default CryptData;
