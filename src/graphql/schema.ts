import { makeSchema, objectType, queryType, mutationType, stringArg, intArg } from 'nexus';

type Lead = {
  id: number;
  created: Date;
  phone: string;
  source: string;
  status: string;
  assignedTo?: string;
};

const LeadType = objectType({
  name: 'Lead',
  definition(t) {
    t.int('id');
    t.string('phone');
    t.string('source');
    t.string('status');
    t.string('assignedTo');
    t.field('created', { type: 'String' });
  }
});

const Query = queryType({
  definition(t) {
    t.list.field('leads', {
      type: LeadType,
      args: {
        filter: stringArg(),
        page: intArg()
      },
      resolve: (_root, args, ctx) => {
        console.log('tenant', ctx.tenantId);
        return [];
      }
    });
  }
});

const Mutation = mutationType({
  definition(t) {
    t.field('assignLead', {
      type: 'Boolean',
      args: { id: intArg(), userId: intArg() },
      resolve: (_root, args, ctx) => {
        console.log('assignLead tenant', ctx.tenantId);
        return true;
      }
    });
    t.field('addLeadNote', {
      type: 'Boolean',
      args: { id: intArg(), note: stringArg() },
      resolve: (_root, args, ctx) => {
        console.log('addLeadNote tenant', ctx.tenantId);
        return true;
      }
    });
  }
});

export const schema = makeSchema({ types: [LeadType, Query, Mutation] });
