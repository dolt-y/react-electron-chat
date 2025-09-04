// 模拟数据
const contacts = [
  {
    id: 1,
    name: "张三",
    avatar: "https://ui-avatars.com/api/?name=张三&size=40&background=4f46e5&color=ffffff",
    lastMessage: "你好，最近怎么样？",
    time: "14:30",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "李四",
    avatar: "https://ui-avatars.com/api/?name=李四&size=40&background=059669&color=ffffff",
    lastMessage: "明天的会议记得参加",
    time: "13:45",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "王五",
    avatar: "https://ui-avatars.com/api/?name=王五&size=40&background=dc2626&color=ffffff",
    lastMessage: "文件已发送，请查收",
    time: "12:20",
    unread: 1,
    online: true,
  },
  {
    id: 4,
    name: "赵六",
    avatar: "https://ui-avatars.com/api/?name=赵六&size=40&background=ea580c&color=ffffff",
    lastMessage: "好的，没问题",
    time: "昨天",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "钱七",
    avatar: "https://ui-avatars.com/api/?name=钱七&size=40&background=7c3aed&color=ffffff",
    lastMessage: "周末一起吃饭吧",
    time: "昨天",
    unread: 3,
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "other",
    content: "你好！最近工作怎么样？",
    time: "14:25",
    type: "text",
  },
  {
    id: 2,
    sender: "me",
    content: "还不错，就是有点忙。你呢？",
    time: "14:26",
    type: "text",
  },
  {
    id: 3,
    sender: "other",
    content: "我也是，最近项目比较多",
    time: "14:27",
    type: "text",
  },
  {
    id: 4,
    sender: "me",
    content: "这是我们的项目文档，你看一下",
    time: "14:28",
    type: "file",
    fileName: "项目需求文档.pdf",
    fileSize: "2.3MB",
  },
  {
    id: 5,
    sender: "other",
    content: "收到了，我稍后查看",
    time: "14:30",
    type: "text",
  },
  {
    id: 6,
    sender: "other",
    content: "https://picsum.photos/300/200?random=1",
    time: "14:31",
    type: "image",
  },
]

export  { contacts, messages };