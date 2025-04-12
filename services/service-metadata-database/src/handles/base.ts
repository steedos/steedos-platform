export type ActionData = {
  name: string;
  [key: string]: unknown;
};

export class BaseHandle {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  async init() {
    console.log(`todo: ${this.type} init`);
  }

  async handleAction(
    action: "inserted" | "updated" | "deleted",
    data: ActionData,
  ) {
    console.log("BaseHandle handleAction", action, JSON.stringify(data));
    switch (action) {
      case "inserted":
        await this.inserted(data);
        break;
      case "updated":
        await this.updated(data);
        break;
      case "deleted":
        await this.deleted(data);
        break;
      default:
        console.warn(`未知的操作类型: ${action}`);
    }
  }

  async inserted(data: ActionData) {
    console.log(`todo: ${this.type} inserted`, data);
  }

  async updated(data: ActionData) {
    console.log(`todo: ${this.type} updated`, data);
  }

  async deleted(data: ActionData) {
    console.log(`todo: ${this.type} deleted`, data);
  }
}
