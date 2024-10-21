

export interface Transport {
    publish(queue: string, message: object): Promise<void>;
    subscribe(queue: string, callback: (message: object) => void): Promise<void>;
}