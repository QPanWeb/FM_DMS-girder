/**
 * The EventStream type wraps window.EventSource to listen to the unified
 * per-user event channel endpoint using the SSE protocol. When events are
 * received on the SSE channel, this triggers a Backbone event of the form
 * 'g:event.<type>' where <type> is the value of the event type field.
 * Listeners can bind to specific event types on the channel.
 */
girder.EventStream = function () {
    if (window.EventSource) {
        this._eventSource = new window.EventSource(
            girder.apiRoot + '/sse_stream');

        var stream = this;
        this._eventSource.addEventListener('message', function (e) {
            try {
                var obj = window.JSON.parse(e.data);
                stream.trigger('g:event.' + obj.type, obj);
            } catch (err) {
                console.error('Invalid JSON from SSE stream: ' + e.data + ',' + err);
                stream.trigger('g:error', e);
            }
        }, false);

        this._eventSource.addEventListener('error', function (e) {
            console.error('SSE stream error');
            stream.trigger('g:error', e);
        }, false);
    } else {
        console.error('EventSource not supported on this platform.');
    }

    return _.extend(this, Backbone.Events);
};
