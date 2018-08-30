
/**
 * Represents a single subscription
 */
export class Subscription {
    /**
     * The constructor.  The subcription objects are created by the SubcriptionHandler.
     * @param handler The subcription handler that is used to handle this subscription
     * @param eventName The name of event
     */
    public constructor(handler:SubscriptionHandler, eventName:string) {
        this._handler = handler;
        this._eventName = eventName;
    }

    /**
     * Returns the name of the event.
     */
    public get eventName():string {
        return this._eventName;
    }

    /**
     * Unsubscribes the subscription
     */
    public unsubscribe() {
        this._handler.unsubcribe(this);
    }

    private _handler:SubscriptionHandler;
    private _eventName:string;
}

/**
 * Represents a subscription handler. Add this handler to a class, when subcriptions 
 * have to be supported.
 */
export class SubscriptionHandler {
    /**
     * Subscribes to an event.
     * @param eventName The name of the event
     * @param callback The callback that has to be called, when the event occurs.
     */
    public subscribe<T>(eventName:string, callback:(eventData?:T)=>void):Subscription {
        let subscription = new TypedSubscription<T>(this, eventName, callback);
        
        let subscriptions = this._subscriptions.get(eventName);
        if (subscriptions) {
            subscriptions.push(subscription);
        } else {
            this._subscriptions.set(eventName, [subscription]);
        }

        return subscription;
    }

    /**
     * Unsubscribes a subscription. Please note, you can also directly call
     * unsubscribe from the sunscription.
     * @param subscription The subscription that has to be unsubscribe.
     */
    public unsubcribe(subscription:Subscription) {
        let subscriptions = this._subscriptions.get(subscription.eventName);
        if (subscriptions) {
            let i = subscriptions.indexOf(subscription);
            if (i >= 0) {
                subscriptions.splice(i,1);
            }
        } else {
            console.warn("The subscription is not part of the object:" + subscription );
        }
    }

    /**
     * Notfies an event.
     * @param eventName The name of the event
     * @param eventData The data of the event
     */
    public notify<T>(eventName:string, eventData?:T) {
        let subscriptions = this._subscriptions.get(eventName);
        if (subscriptions) {
            for (let i = 0; i < subscriptions.length; ++i) {
                (<TypedSubscription<T>>subscriptions[i]).notify(eventData);
            }
        }
    }

    private _subscriptions:Map<string, Subscription[]> = new Map<string, Subscription[]>();
}

/**
 * Represents a typed subscription.
 */
class TypedSubscription<T> extends Subscription {
    public constructor(handler:SubscriptionHandler, eventName:string, callback:(eventData?:T)=>void) {
        super(handler, eventName);
        this._callback = callback;
    }

    public notify(eventData?:T) {
        this._callback(eventData);
    }

    private _callback:(eventData?:T)=>void;
}
