import { JwtService } from '@nestjs/jwt';
import { SquadUserRepositoryInterface } from '../interfaces/squad-user.repository.interface';
import { createHash } from 'crypto';

export const itHasNext = (total: number, page: number, pageSize: number) =>
  total > page * pageSize;

export const formatToDate = (date: Date): string =>
  date.toJSON().split('T').shift().split('-').reverse().join('/');

export const formatDateToLongStringVersion = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  });
};

export const textToMD5Hash = (text: string) =>
  createHash('md5').update(text).digest('hex');

export const decodeBase64 = (base64string: string) =>
  JSON.parse(Buffer.from(base64string, 'base64').toString());

export const fixCPFLength = (cpf: string) => {
  let cleanCPF: any = String(cpf).match(/\d+/g);
  cleanCPF = cleanCPF ? cleanCPF.join([]) : '';
  return cleanCPF.length < 11
    ? cleanCPF.replace(/^/, '0'.repeat(11 - cleanCPF.length))
    : cleanCPF;
};

export const findSquadUserByToken = async (
  squadUserToken: string,
  jwtService: JwtService,
  squadUserRepository: SquadUserRepositoryInterface,
): Promise<string> => {
  if (typeof squadUserToken !== 'undefined') {
    const { name, email, user_id } = <any>jwtService.decode(squadUserToken);

    const squadUser = await squadUserRepository.findOneByCondition({
      name,
      email,
      squaduserid: user_id,
    });

    if (typeof squadUser !== 'undefined') {
      return squadUser.squaduserid;
    }
  }
  return '';
};
/**
 * Returns the start and end position of the requested page
 * and whether it has next items after it.
 * @param total Size of full list.
 * @param page Requested page number.
 * @param pageSize Amount of items per page.
 * @returns Object containing 'pageStart' and 'pageEnd'
 * indexes and 'hasNext' boolean value.
 */
export const getPaginationIndexes = (
  total: number,
  page = 1,
  pageSize = 1000,
): { pageStart: number; pageEnd: number; hasNext: boolean } => {
  const pageStart = (page - 1) * pageSize;
  const hasNext = itHasNext(total, page, pageSize);
  const pageEnd = !hasNext ? total : page * pageSize;
  return {
    hasNext: hasNext,
    pageStart: pageStart,
    pageEnd: pageEnd,
  };
};

export const isIntegrationId = (text: string): boolean => {
  const regex = /.*([A-Z]{3})([0-9]{4}).*/;
  return regex.exec(text) !== null;
};

/**
 * Applies the keyTransformerFunction to targetObject's keys, except the ones in excludeKeys.
 * @param targetObj - Target object to apply changes.
 * @param keyTransformerFunction - Function to apply to each object key.
 * @param excludeKeys - List of keys not to apply the transformation.
 * @returns New object with transformed keys.
 */
export const transformObjectKeys = (
  targetObj: any,
  keyTransformerFunction: (key: string) => string,
  excludeKeys: string[] = [],
) => {
  const newObj = {};
  Object.keys(targetObj).map((key) => {
    if (!excludeKeys.includes(key)) {
      const transformedKey = keyTransformerFunction(key);
      newObj[transformedKey] = targetObj[key];
    }
  });
  excludeKeys.map((key) => {
    newObj[key] = targetObj[key];
  });
  return newObj;
};

export const dateDifferenceInDays = (endDate, startDate) => {
  return Math.floor((endDate - startDate) / 86400000);
};

export const capitalizeString = (str: string): string => {
  const lower = str.toLowerCase();
  return lower.replace(lower[0], lower[0].toUpperCase());
};

export const extractBearerToken = (headers: {
  authorization: string;
}): string | undefined =>
  headers?.authorization ? headers.authorization.split(' ').pop() : undefined;
