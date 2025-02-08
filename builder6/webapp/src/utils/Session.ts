import { Builder } from '@builder6/react';

// 兼容 Meteor 的 Session
export const Session = {
  get: (key: string) => {
    return Builder.settings[key];
  },
  set: (key: string, value: string) => {
    return Builder.settings[key] = value;
  }
}