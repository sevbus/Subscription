import {SubscriptionHandler, Subscription} from "./Subscription";

/**
 * Represents a property changed event
 */
export interface PropertyChangedEvent<T> {
    /**
     * The name of the property
     */
    propertyName: string;

    /**
     * The new value of the property
     */
    newValue:T;

    /**
     * The old value of the property
     */
    oldValue?:T;
}

/**
 * Represents the public part of a property changed event handler. To make a property changed event
 * handler public. Use the class PropertyEventtHandler as private or protected member
 * and expose this interface only.
 */
export interface IPropertyChangedHandler {
    /**
     * Subscribe for changes of a property
     * @param propertyName The name of the property
     * @param callback The callback to be called when the property has been changed
     */
    subscribe<T>(propertyName:string, callback:(e?:PropertyChangedEvent<T>)=>void):Subscription;
}

/**
 * Represents a property changed event handler. To make a property changed event
 * handler public. Use the this class as private or protected member
 * and expose the IPropertyChangedHandler interface only.
 */
export class PropertyChangedHandler implements IPropertyChangedHandler {
    /**
     * Subscribe for changes of a property
     * @param propertyName The name of the property
     * @param callback The callback to be called when the property has been changed
     */
    public subscribe<T>(propertyName:string, callback:(e?:PropertyChangedEvent<T>)=>void):Subscription {
        return this._subscriptionHandler.subscribe<PropertyChangedEvent<T>>(propertyName, callback);
    }

    /**
     * 
     * @param propertyName The name of the property
     * @param newValue The new value of the property
     * @param oldValue The old value of the property
     */
    public notify<T>(propertyName:string, newValue:T, oldValue?:T) {
        let e:PropertyChangedEvent<T> = {
            propertyName:propertyName,
            newValue:newValue,
            oldValue:oldValue
        }

        this._subscriptionHandler.notify(propertyName, e);
    }

    private _subscriptionHandler:SubscriptionHandler = new SubscriptionHandler();
}

/**
 * Provides public access to a property changed event handler
 */
export interface INotifyPropertyChanged {
    propertyChanged:IPropertyChangedHandler;
}

/**
 * Represents the public part of an event handler. To make an event
 * handler public. Use the class EventtHandler as private or protected member
 * and expose this interface only.
 */
export interface IEventHandler {
    subscribe<T>(eventName:string, callback:(e?:T)=>void):Subscription;
}

/**
 * Represents an event handler. To make an event
 * handler public. Use the this class as private or protected member
 * and expose the IEventHandler interface only.
 */
export class EventHandler implements IEventHandler {
    public subscribe<T>(eventName:string, callback:(e?:T)=>void):Subscription {
        return this._subscriptionHandler.subscribe(eventName, callback);
    }

    public notify<T>(eventName:string, e?:T) {
        this._subscriptionHandler.notify(eventName, e);
    }

    private _subscriptionHandler:SubscriptionHandler = new SubscriptionHandler();
}

/**
 * Provides public access to an event handler
 */
export interface INotifyEvent {
    eventHandler:IEventHandler;
}
