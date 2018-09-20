import bcrypt from 'bcrypt';

class CryptData {
  static encryptData(dataToEncrypt) {
    const salt = bcrypt.genSaltSync();
    const encrypted = bcrypt.hash(dataToEncrypt, salt);
    return encrypted;
  }

  static decryptData(dataToDecrypt, dataBaseHash) {
    return bcrypt.compare(dataToDecrypt, dataBaseHash);
  }
}
export default CryptData;
