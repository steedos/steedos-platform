

export class Broker{
    broker: any;

    init(broker: any){
        this.broker = broker;
    }

    getOptions(){
        return this.broker?.options;
    }

    getSettings(){
        return this.getOptions()?.settings;
    }

    async call(method, ...args){
        if(!this.broker){
            throw new Error("broker is not initialized");
        }
        return await this.broker.call(method, ...args);
    }
}