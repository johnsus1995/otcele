import CryptoJS from 'crypto-js';
import { atom } from 'recoil';

type TDefaultValues = {
  state: any;
  id?: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  image: string;
  currentPageName: string;
  selectedOfficial?: any;
  consentForESign?: boolean;
  selectedBillVote?: string | null;
  score?: number;
  signature?: string;
};

const defaultValues: TDefaultValues = {
  id: '',
  email: 'test@gmail.com',
  userName: 'test',
  firstName: '',
  lastName: '',
  image: '',
  currentPageName: '',
  selectedOfficial: {},
  consentForESign: false,
  selectedBillVote: null,
  state: null,
  signature: '',
};

const secretKey = process.env.CRYPTO_SECRET;

export const localStorageEffect =
  (key: string) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  ({ setSelf, onSet }: { setSelf: Function; onSet: Function }) => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        // Decrypt and parse the data before setting it to the state
        try {
          const bytes = CryptoJS.AES.decrypt(savedValue, secretKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setSelf(decryptedData);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error decrypting user details', e);
        }
      }

      onSet((newValue: unknown, _: unknown, isReset: unknown) => {
        if (isReset) {
          localStorage.removeItem(key);
        } else {
          // Encrypt the data before saving it to local storage
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(newValue),
            secretKey,
          ).toString();
          localStorage.setItem(key, encryptedData);
        }
      });
    }
  };

export const userAtom = atom({
  key: 'userState',
  default: defaultValues,
  effects: [localStorageEffect('userDetails')],
});
