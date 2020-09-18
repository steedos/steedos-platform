import {createHashHistory} from 'history';

export const hashHistory = typeof window !== 'undefined'?createHashHistory():null;
