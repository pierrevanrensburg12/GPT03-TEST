import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export interface TenantAuthOptions {
  pg: { query: (q: string, params?: any[]) => Promise<any> };
}

declare module 'fastify' {
  interface FastifyRequest {
    tenantId?: string;
  }
}

const tenantAuthPlugin: FastifyPluginAsync<TenantAuthOptions> = async (
  fastify,
  opts
) => {
  fastify.decorateRequest('tenantId', null);

  fastify.addHook('preHandler', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    const token = auth.substring('Bearer '.length);
    const payload = await fastify.jwt.verify<{ tenant_id: string }>(token);
    request.tenantId = payload.tenant_id;
    await opts.pg.query(
      'set search_path to tenant_' + payload.tenant_id + ',public'
    );
  });
};

export default fp(tenantAuthPlugin);
