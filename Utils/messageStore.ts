type Message = {
  content: string;
  from: any;
  to: any;
};
export default class InMemoryMessageStore {
  public messages: Array<Message>;
  constructor() {
    this.messages = [];
  }

  saveMessage(message: Message) {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string) {
    return this.messages.filter(
      ({ from, to }) =>
        (from?.id as string) === userID || (to?.id as string) === userID
    );
  }

  findPrivateMessages(userID_first: string, userID_second: string) {
    return this.messages.filter(
      ({ from, to }) =>
        ((from.id as string) === userID_first &&
          (to.id as string) === userID_second) ||
        ((from.id as string) === userID_second &&
          (to.id as string) === userID_first)
    );
  }
}
