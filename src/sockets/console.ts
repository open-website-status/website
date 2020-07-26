import io from 'socket.io-client';
import { EventEmitter } from 'typed-event-emitter';
import { Provider, ProviderListMessage } from '@/sockets/types';

export default class ConsoleSocket extends EventEmitter {
  private socket: SocketIOClient.Socket;

  public onConnect = this.registerEvent<() => unknown>();
  public onDisconnect = this.registerEvent<() => unknown>();
  public onProviderList = this.registerEvent<(providers: Provider[]) => unknown>();

  constructor (token: string) {
    super();

    this.socket = io(process.env.VUE_APP_SERVER_URL, {
      query: {
        token,
      },
      path: '/console-socket',
    });

    this.socket.on('provider-list', (message: ProviderListMessage) => this.emit(this.onProviderList, message.data));

    this.socket.on('connect', () => this.emit(this.onConnect));
    this.socket.on('disconnect', () => this.emit(this.onDisconnect));
  }

  public createProvider (name: string, reCaptchaResponse: string) {
    return new Promise<Provider>((resolve, reject) => {
      this.socket.emit('create-provider', {
        name,
        reCaptchaResponse,
      }, (error: string, provider: Provider) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(provider);
        }
      });
    });
  }

  public renameProvider (id: string, name: string) {
    return new Promise<Provider>((resolve, reject) => {
      this.socket.emit('rename-provider', {
        id,
        name,
      }, (error: string, provider: Provider) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(provider);
        }
      });
    });
  }

  public resetProviderToken (id: string) {
    return new Promise<Provider>((resolve, reject) => {
      this.socket.emit('reset-provider-token', {
        id,
      }, (error: string, provider: Provider) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(provider);
        }
      });
    });
  }

  public close () {
    this.socket.close();
  }
}
