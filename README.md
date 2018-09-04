** Work in progress **

# Subscription
This small package provides a set of classes and interfaces to implement a subscription pattern in TypeScript. However you can use it in plain JavaScript as well.

## Installation 
```
npm install @sevbus/subscription
```

## Getting started

### Notifying an event

```javascript
import {INotifyEvent, IEventHandler, EventHandler} from "@sevbus/subscription";

interface EventData {
    // some event data
    name:string;
    count:number;
}

class MyObject implements INotifyEvent {
    public get eventHandler():IEventHandler {
        return this._eventHandler;
    }
       
    public do() {
        // do something
                        
        this._eventHandler.notify<EventData>("done", {name:"test", count:1});
    }
    
    private _eventHandler = new EventHandler();
}
```

### Subscribing for an event
```javascript
let myObject = new MyObject();

let subscription = myObject.eventHandler.subscribe("done", (e?:EventData) => {
    console.info("done");    
});

```

### Unsubscribing 
```javascript
subscription.unsubscribe();
```

### Notifying a PropertyChangedEvent

```javascript
import {INotifyPropertyChanged, IPropertyChangedHandler, PropertyChangedHandler} from "@sevbus/subscription";

class MyObject implements INotifyPropertyChanged {
    public get propertyChanged():IPropertyChangedHandler {
        return this._propertyChanged;
    }
    
    public get myProperty():string {
        return this._myProperty;
    }
    
    public set myProperty(value:string) {
        let oldValue = this._myProperty;
        this._myProperty = value;
        this._propertyChanged.notify("myProperty", value, oldValue);
    }
    
    private _propertyChanged = new PropertyChangedHandler();
}
```

### Subscribing for a PropertyChangedEvent
```javascript
let myObject = new MyObject();

let subscription = myObject.propertyChanged.subscribe("myProperty", (e:PropertyChangedEvent<string>) => {
    console.info("myProperty + " e.newValue + " " + e.oldValue);    
});

```







