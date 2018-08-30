import "mocha";
import {expect} from "chai";
import {SubscriptionHandler} from "../src/Subscription";

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


