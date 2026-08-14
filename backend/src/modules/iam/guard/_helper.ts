import { DOMAIN_ID_HEADER, DOMAIN_ID_PARAMETER } from '@/utils/types/utils';
import { FastifyRequest } from 'fastify';

export default function guardHelper() {
  
  function extractBearerToken(request: FastifyRequest): string | undefined {
    const fromCookie = request.cookies?.['access_token'];
    if (fromCookie) return fromCookie;

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length);
    }

    return undefined;
  }

  function extractBasicCredentials(request: FastifyRequest): { identity: string; password: string } | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Basic ')) return undefined;

    const decoded = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString();
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return undefined;

    return {
      identity: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  }

  function extractDomainId(
    request: FastifyRequest<{
      Params: { [DOMAIN_ID_PARAMETER]?: string };
      Querystring: { [DOMAIN_ID_PARAMETER]?: string };
      Headers: { [DOMAIN_ID_HEADER]?: string };
    }>,
  ): string | undefined {
    const headerValue = request.headers[DOMAIN_ID_HEADER];
    const fromHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    return fromHeader ?? request.params[DOMAIN_ID_PARAMETER] ?? request.query[DOMAIN_ID_PARAMETER];
  }

  return {
    extractBasicCredentials,
    extractBearerToken,
    extractDomainId,
  };
}
