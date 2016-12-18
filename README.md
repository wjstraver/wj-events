# WJEvents
Inspired by Backbone Events, I build my own eventlistener to extend on classes.

## Usage
It is possible to use WJEvents directly, but it more usefull to extend it on your classes. in `example/` is a simple example of how it can be used. Below is a small guide:
1 `extend(myClass, WJEvents);`
2 `myClass.on('name-of-the-event', myFunction);`
3 `myClass.trigger('name-of-the-event1, arg1, arg2, ...);`

## Functions
- .on(eventName, callback)
- .once(eventName, callback)
- .off(eventName, callback)
- .trigger(eventName, arg1, arg2, ...)
- .kill()
