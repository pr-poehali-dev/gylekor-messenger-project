import { CONTACTS } from "./data";
import Icon from "@/components/ui/icon";

interface ContactsTabProps {
  searchQuery: string;
}

export default function ContactsTab({ searchQuery }: ContactsTabProps) {
  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = filtered.reduce((acc, contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, typeof filtered>);

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-3 hover:bg-white/5 transition-all duration-200"
        style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px dashed rgba(124, 58, 237, 0.3)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
          <Icon name="UserPlus" size={22} className="text-white" />
        </div>
        <span className="text-purple-400 font-semibold text-sm">Пригласить друга</span>
      </button>

      {Object.entries(grouped).sort().map(([letter, contacts]) => (
        <div key={letter}>
          <div className="px-3 py-1 mb-1">
            <span className="text-xs font-bold gradient-brand-text">{letter}</span>
          </div>
          {contacts.map((contact, i) => (
            <button
              key={contact.id}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 hover:bg-white/5 transition-all duration-200 animate-fade-in text-left"
              style={{ animationDelay: `${i * 0.05}s` }}>

              <div className="relative flex-shrink-0">
                <div className="avatar-ring">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
                    {contact.avatar}
                  </div>
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2"
                    style={{ borderColor: 'hsl(240, 15%, 6%)' }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{contact.name}</div>
                <div className="text-muted-foreground text-xs">@{contact.username}</div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  <Icon name="MessageCircle" size={16} className="text-purple-400" />
                </div>
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  <Icon name="Phone" size={16} className="text-purple-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
