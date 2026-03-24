export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  time: string;
  out: boolean;
  type?: "text" | "voice" | "sticker";
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
}

export interface Status {
  id: string;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  gradient: string;
}

export const CHATS: Chat[] = [
  {
    id: "1",
    name: "Алина Звёздная",
    avatar: "А",
    lastMessage: "Жду тебя завтра! 🔥",
    time: "18:42",
    unread: 3,
    online: true,
    messages: [
      { id: "m1", text: "Привет! Как дела?", time: "18:30", out: false },
      { id: "m2", text: "Всё отлично! Работаю над новым проектом", time: "18:32", out: true },
      { id: "m3", text: "О, круто! Расскажи подробнее 😊", time: "18:35", out: false },
      { id: "m4", text: "Делаю мессенджер нового поколения — Гылекор!", time: "18:37", out: true },
      { id: "m5", text: "Вау, звучит невероятно! Мне нравится название 💜", time: "18:39", out: false },
      { id: "m6", text: "Жду тебя завтра! 🔥", time: "18:42", out: false },
    ]
  },
  {
    id: "2",
    name: "Макс Кодер",
    avatar: "М",
    lastMessage: "Код готов, проверяй PR",
    time: "17:15",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", text: "Привет, как там с бэкендом?", time: "16:00", out: true },
      { id: "m2", text: "Делаю, скоро будет", time: "16:30", out: false },
      { id: "m3", text: "Код готов, проверяй PR", time: "17:15", out: false },
    ]
  },
  {
    id: "3",
    name: "Команда Дизайна",
    avatar: "🎨",
    lastMessage: "Новые макеты в Figma ✨",
    time: "16:00",
    unread: 12,
    online: false,
    messages: [
      { id: "m1", text: "Всем привет! Загрузила новые экраны", time: "15:45", out: false },
      { id: "m2", text: "Новые макеты в Figma ✨", time: "16:00", out: false },
    ]
  },
  {
    id: "4",
    name: "Рита Цифрова",
    avatar: "Р",
    lastMessage: "👍",
    time: "14:20",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", text: "Ты видел новое обновление?", time: "14:15", out: false },
      { id: "m2", text: "Да, круто сделали!", time: "14:18", out: true },
      { id: "m3", text: "👍", time: "14:20", out: false },
    ]
  },
  {
    id: "5",
    name: "Дима Нейросеть",
    avatar: "Д",
    lastMessage: "Отправил тебе статью про LLM",
    time: "12:00",
    unread: 1,
    online: false,
    messages: [
      { id: "m1", text: "Привет! Есть интересная новость", time: "11:55", out: false },
      { id: "m2", text: "Расскажи!", time: "11:57", out: true },
      { id: "m3", text: "Отправил тебе статью про LLM", time: "12:00", out: false },
    ]
  },
];

export const CONTACTS: Contact[] = [
  { id: "1", name: "Алина Звёздная", username: "alina_star", avatar: "А", online: true },
  { id: "2", name: "Макс Кодер", username: "max_coder", avatar: "М", online: true },
  { id: "3", name: "Рита Цифрова", username: "rita_digital", avatar: "Р", online: false, lastSeen: "вчера в 20:00" },
  { id: "4", name: "Дима Нейросеть", username: "dima_ai", avatar: "Д", online: false, lastSeen: "3 часа назад" },
  { id: "5", name: "Соня Графика", username: "sonya_g", avatar: "С", online: true },
  { id: "6", name: "Артём Продукт", username: "artem_pm", avatar: "А", online: false, lastSeen: "сегодня в 10:00" },
];

export const STATUSES: Status[] = [
  { id: "1", name: "Алина", avatar: "А", time: "5 мин назад", viewed: false, gradient: "from-purple-500 to-pink-500" },
  { id: "2", name: "Макс", avatar: "М", time: "1 ч назад", viewed: false, gradient: "from-blue-500 to-cyan-500" },
  { id: "3", name: "Рита", avatar: "Р", time: "2 ч назад", viewed: true, gradient: "from-orange-500 to-yellow-500" },
  { id: "4", name: "Соня", avatar: "С", time: "3 ч назад", viewed: true, gradient: "from-green-500 to-teal-500" },
  { id: "5", name: "Артём", avatar: "А", time: "5 ч назад", viewed: true, gradient: "from-red-500 to-pink-500" },
];
