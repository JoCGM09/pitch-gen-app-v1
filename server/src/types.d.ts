declare module 'socket.io' {
  export class Server {
    constructor(server: any, opts?: any);
    on(event: string, listener: (socket: any) => void): any;
    emit(event: string, ...args: any[]): any;
  }
}
