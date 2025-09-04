import React from 'react';
import './ChatLayout.scss';

const contacts = [
  { id: 1, name: 'Alice', online: true },
  { id: 2, name: 'Bob', online: false },
  { id: 3, name: 'Charlie', online: true },
];

const ContactList: React.FC = () => (
  <div className="contact-list">
    {contacts.map(c => (
      <div key={c.id} className="contact-item">
        <div className="avatar" />
        <div className="name">{c.name}</div>
        {c.online && <div className="status" />}
      </div>
    ))}
  </div>
);

export default ContactList;
