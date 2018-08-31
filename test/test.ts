import "mocha";
import {expect, assert} from "chai";
import {SubscriptionHandler} from "../src/Subscription";
import {EventHandler, IEventHandler, INotifyEvent, PropertyChangedHandler, IPropertyChangedHandler, INotifyPropertyChanged, PropertyChangedEvent} from "../src/EventHandler";

it("subscribe return subscription object", () => {
    let handler = new SubscriptionHandler();
    let subscription = handler.subscribe("test", () => {
    });

    expect(subscription).not.to.be.null;
    expect(subscription.eventName).equals("test");
})


it("subscribe with no event data", (done) => {
    let handler = new SubscriptionHandler();
    handler.subscribe("test", (e:any) => {
        expect(e).equal(undefined)
        done();
    });

    handler.notify("test");
})


it("subscribe with event data", (done) => {
    let handler = new SubscriptionHandler();
    handler.subscribe("test", (e:any) => {
        expect(e).equal("test data");
        done();
    });

    handler.notify("test", "test data");
})


it("subscribe, unsubscribe", () => {
    let handler = new SubscriptionHandler();
    let count = 0;
    let subscription = handler.subscribe("test", () => {
        ++count;
    });

    subscription.unsubscribe();

    handler.notify("test", "test data");

    expect(count).equal(0);
})

it("subscribe, notify different event", () => {
    let handler = new SubscriptionHandler();
    let count = 0;
    handler.subscribe("test", () => {
        ++count;
    });
  
    handler.notify("different", "test data");

    expect(count).equal(0);
})


class A implements INotifyEvent, INotifyPropertyChanged {
    public get eventHandler():IEventHandler {
        return this._eventHandler;
    }

    public get propertyChanged():IPropertyChangedHandler {
        return this._propertyChanged;
    }

    public get a():string {
        return this._a;
    }

    public set a(a:string) {
        let oldValue = this._a;
        this._a = a;
        this._propertyChanged.notify("a", a, oldValue);
    }

    public get b():{b1:string, b2:number} {
        return this._b;
    }

    public set b(b:{b1:string, b2:number}) {
        let oldValue = this._b;
        this._b = b;
        this._propertyChanged.notify("b", b, oldValue);
    }

    public do() {
        this._eventHandler.notify("do", "something happend")
    }

    private _a:string = "";
    private _b: {b1:string, b2:number} = {b1:"", b2:0};

    private _eventHandler = new EventHandler();
    private _propertyChanged = new PropertyChangedHandler();
}

it("subscribe for property a", () => {
    let a = new A();
    a.propertyChanged.subscribe("a", (e?:PropertyChangedEvent<string>) => {
        if (e) {
            expect(e.propertyName).equal("a");
            expect(e.newValue).equal("test");
        } else {
            assert(false);
        }
    });

    a.a = "test";
});

it("subscribe for property a and check old value", () => {
    let a = new A();
    a.a = "old";
    a.propertyChanged.subscribe("a", (e?:PropertyChangedEvent<string>) => {
        if (e) {
            expect(e.propertyName).equal("a");
            expect(e.newValue).equal("test");
            expect(e.oldValue).equal("old");
        } else {
            assert(false);
        }
    });

    a.a = "test";
});

it("subscribe for property b", () => {
    let a = new A();
    a.propertyChanged.subscribe("b", (e?:PropertyChangedEvent<{b1:string, b2:number}>) => {
        if (e) {
            expect(e.propertyName).equal("b");
            expect(e.newValue.b1).equal("test");
            expect(e.newValue.b2).equal(4711);
        } else {
            assert(false);
        }
        
    });

    a.b = {b1:"test", b2:4711};
});

it("subscribe for event do", () => {
    let a = new A();
    a.eventHandler.subscribe<string>("do", (e?:string) => {
        if (e) {
            expect(e).equal("something happend")
        } else {
            assert(false);
        }
        
    } );

    a.do();
});

