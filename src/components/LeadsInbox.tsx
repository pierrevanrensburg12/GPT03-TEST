import React, { useEffect, useState } from 'react';

interface Lead {
  id: number;
  created: string;
  phone: string;
  source: string;
  status: string;
  assignedTo?: string;
}

const LeadsInbox: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    fetch('/api/graphql', { method: 'POST', body: JSON.stringify({ query: '{ leads { id phone source status created } }' }) })
      .then(r => r.json())
      .then(data => setLeads(data.data.leads));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Created</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Assigned to</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} onClick={() => setSelected(lead)}>
              <td>{lead.created}</td>
              <td>{lead.phone}</td>
              <td>{lead.source}</td>
              <td>{lead.status}</td>
              <td>{lead.assignedTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="drawer">
          <h3>Lead {selected.id}</h3>
          <p>Phone: {selected.phone}</p>
          {/* Additional details + tags select would go here */}
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LeadsInbox;
