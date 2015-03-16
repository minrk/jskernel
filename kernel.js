define([
    "base/js/namespace",
], function (IPython) {
    
    var kernel_info = function (callback) {
        var reply = this._get_msg("kernel_info_reply", {
            protocol_version: '5.0.0',
            implementation: 'jskernel',
            implementation_version: '0.0.3',
            language_info: {
                name: "javascript",
                mimetype: "text/javascript",
                file_extension: '.js'
            }
        });
        
        if (callback) {
            callback(reply);
        }
    };
    
    var disabled = function () {};
    
    var return_true = function () {
        return true;
    };
    
    var return_false = function () {
        return false;
    };
    
    var execute = function (code, callbacks, options) {
        var that = this;
        var request = this._get_msg("execute_request", {code: code});
        this.set_callbacks_for_msg(request.header.msg_id, callbacks);
        
        var r = null;
        var success = true;
        var save_console_log = console.log;
        console.log = function () {
            /** turn console.log into stdout messages */
            var data = "";
            for (var i = 0; i < arguments.length; i++) {
                if (i) data += " ";
                data += arguments[i];
            }
            data += "\n";
            var msg = that._get_msg("stream", {name: "stdout", text: data});
            msg.parent_header = request.header;
            that._handle_iopub_message(msg);
        };
        try {
            r = eval(code);
        } catch(err) {
            r = err;
            success = false;
        }
        console.log = save_console_log;
        var reply = this._get_msg("execute_reply", {
            status : "ok",
            execution_count: this.execution_count
        });
        reply.parent_header = request.header;
        var result = null;
        if (r !== null && r !== undefined) {
            if (success) {
                result = this._get_msg("execute_result", {
                    execution_count: this.execution_count,
                    data : {
                        'text/plain' : "" + r
                    },
                    metadata : {}
                });
            } else if (!success){
                result = this._get_msg("error", {
                    execution_count: this.execution_count,
                    ename : r.name,
                    evalue : r.message,
                    traceback : [r.stack]
                });
            }
            result.parent_header = request.header;
            this._handle_iopub_message(result);
        }
        
        var idle = this._get_msg("status", {status: "idle"});
        idle.parent_header = request.header;
        
        this.execution_count = this.execution_count + 1;
        this._handle_iopub_message(idle);
        this._handle_shell_reply(reply);
    };

    
    var onload = function () {
        var kernel = IPython.notebook.kernel;
        console.log("monkeypatching kernel for in-browser js", kernel);
        kernel.execution_count = 1;
        // monkeypatch methods
        kernel.is_connected = return_true;
        kernel.is_fully_disconnected = return_false;
        kernel.inspect = kernel.complete = disabled;
        kernel.execute = execute;
        kernel.kernel_info = kernel_info;
        
        // stop websockets, and signal that we are all connected
        for (var c in kernel.channels) {
            var channel = kernel.channels[c];
            channel.onclose = disabled;
            channel.onerror = disabled;
        }
        kernel.start_channels = function () {
            kernel._kernel_connected();
        };
        kernel.stop_channels();
        kernel.start_channels();
    };
    
    return {
        onload: onload
    };
});
