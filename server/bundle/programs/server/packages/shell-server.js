(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var socket;

var require = meteorInstall({"node_modules":{"meteor":{"shell-server":{"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/shell-server/main.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("./shell-server.js", {
  "*": "*"
}, 0);
let listen;
module.link("./shell-server.js", {
  listen(v) {
    listen = v;
  }

}, 1);
const shellDir = process.env.METEOR_SHELL_DIR;

if (shellDir) {
  listen(shellDir);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"shell-server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/shell-server/shell-server.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    listen: () => listen,
    disable: () => disable
  });
  let assert;
  module1.link("assert", {
    default(v) {
      assert = v;
    }

  }, 0);
  let pathJoin;
  module1.link("path", {
    join(v) {
      pathJoin = v;
    }

  }, 1);
  let PassThrough;
  module1.link("stream", {
    PassThrough(v) {
      PassThrough = v;
    }

  }, 2);
  let closeSync, openSync, readFileSync, unlink, writeFileSync, writeSync;
  module1.link("fs", {
    closeSync(v) {
      closeSync = v;
    },

    openSync(v) {
      openSync = v;
    },

    readFileSync(v) {
      readFileSync = v;
    },

    unlink(v) {
      unlink = v;
    },

    writeFileSync(v) {
      writeFileSync = v;
    },

    writeSync(v) {
      writeSync = v;
    }

  }, 3);
  let createServer;
  module1.link("net", {
    createServer(v) {
      createServer = v;
    }

  }, 4);
  let replStart;
  module1.link("repl", {
    start(v) {
      replStart = v;
    }

  }, 5);
  const INFO_FILE_MODE = parseInt("600", 8); // Only the owner can read or write.

  const EXITING_MESSAGE = "Shell exiting..."; // Invoked by the server process to listen for incoming connections from
  // shell clients. Each connection gets its own REPL instance.

  function listen(shellDir) {
    function callback() {
      new Server(shellDir).listen();
    } // If the server is still in the very early stages of starting up,
    // Meteor.startup may not available yet.


    if (typeof Meteor === "object") {
      Meteor.startup(callback);
    } else if (typeof __meteor_bootstrap__ === "object") {
      const hooks = __meteor_bootstrap__.startupHooks;

      if (hooks) {
        hooks.push(callback);
      } else {
        // As a fallback, just call the callback asynchronously.
        setImmediate(callback);
      }
    }
  }

  function disable(shellDir) {
    try {
      // Replace info.json with a file that says the shell server is
      // disabled, so that any connected shell clients will fail to
      // reconnect after the server process closes their sockets.
      writeFileSync(getInfoFile(shellDir), JSON.stringify({
        status: "disabled",
        reason: "Shell server has shut down."
      }) + "\n", {
        mode: INFO_FILE_MODE
      });
    } catch (ignored) {}
  }

  // Shell commands need to be executed in a Fiber in case they call into
  // code that yields. Using a Promise is an even better idea, since it runs
  // its callbacks in Fibers drawn from a pool, so the Fibers are recycled.
  const evalCommandPromise = Promise.resolve();

  class Server {
    constructor(shellDir) {
      assert.ok(this instanceof Server);
      this.shellDir = shellDir;
      this.key = Math.random().toString(36).slice(2);
      this.server = createServer(socket => {
        this.onConnection(socket);
      }).on("error", err => {
        console.error(err.stack);
      });
    }

    listen() {
      const infoFile = getInfoFile(this.shellDir);
      unlink(infoFile, () => {
        this.server.listen(0, "127.0.0.1", () => {
          writeFileSync(infoFile, JSON.stringify({
            status: "enabled",
            port: this.server.address().port,
            key: this.key
          }) + "\n", {
            mode: INFO_FILE_MODE
          });
        });
      });
    }

    onConnection(socket) {
      // Make sure this function doesn't try to write anything to the socket
      // after it has been closed.
      socket.on("close", function () {
        socket = null;
      }); // If communication is not established within 1000ms of the first
      // connection, forcibly close the socket.

      const timeout = setTimeout(function () {
        if (socket) {
          socket.removeAllListeners("data");
          socket.end(EXITING_MESSAGE + "\n");
        }
      }, 1000); // Let connecting clients configure certain REPL options by sending a
      // JSON object over the socket. For example, only the client knows
      // whether it's running a TTY or an Emacs subshell or some other kind of
      // terminal, so the client must decide the value of options.terminal.

      readJSONFromStream(socket, (error, options, replInputSocket) => {
        clearTimeout(timeout);

        if (error) {
          socket = null;
          console.error(error.stack);
          return;
        }

        if (options.key !== this.key) {
          if (socket) {
            socket.end(EXITING_MESSAGE + "\n");
          }

          return;
        }

        delete options.key; // Set the columns to what is being requested by the client.

        if (options.columns && socket) {
          socket.columns = options.columns;
        }

        delete options.columns;
        options = Object.assign(Object.create(null), // Defaults for configurable options.
        {
          prompt: "> ",
          terminal: true,
          useColors: true,
          ignoreUndefined: true
        }, // Configurable options
        options, // Immutable options.
        {
          input: replInputSocket,
          useGlobal: false,
          output: socket
        }); // The prompt during an evaluateAndExit must be blank to ensure
        // that the prompt doesn't inadvertently get parsed as part of
        // the JSON communication channel.

        if (options.evaluateAndExit) {
          options.prompt = "";
        } // Start the REPL.


        this.startREPL(options);

        if (options.evaluateAndExit) {
          this._wrappedDefaultEval.call(Object.create(null), options.evaluateAndExit.command, global, options.evaluateAndExit.filename || "<meteor shell>", function (error, result) {
            if (socket) {
              function sendResultToSocket(message) {
                // Sending back a JSON payload allows the client to
                // distinguish between errors and successful results.
                socket.end(JSON.stringify(message) + "\n");
              }

              if (error) {
                sendResultToSocket({
                  error: error.toString(),
                  code: 1
                });
              } else {
                sendResultToSocket({
                  result
                });
              }
            }
          });

          return;
        }

        delete options.evaluateAndExit;
        this.enableInteractiveMode(options);
      });
    }

    startREPL(options) {
      // Make sure this function doesn't try to write anything to the output
      // stream after it has been closed.
      options.output.on("close", function () {
        options.output = null;
      });
      const repl = this.repl = replStart(options);
      const {
        shellDir
      } = this; // This is technique of setting `repl.context` is similar to how the
      // `useGlobal` option would work during a normal `repl.start()` and
      // allows shell access (and tab completion!) to Meteor globals (i.e.
      // Underscore _, Meteor, etc.). By using this technique, which changes
      // the context after startup, we avoid stomping on the special `_`
      // variable (in `repl` this equals the value of the last command) from
      // being overridden in the client/server socket-handshaking.  Furthermore,
      // by setting `useGlobal` back to true, we allow the default eval function
      // to use the desired `runInThisContext` method (https://git.io/vbvAB).

      repl.context = global;
      repl.useGlobal = true;
      setRequireAndModule(repl.context); // In order to avoid duplicating code here, specifically the complexities
      // of catching so-called "Recoverable Errors" (https://git.io/vbvbl),
      // we will wrap the default eval, run it in a Fiber (via a Promise), and
      // give it the opportunity to decide if the user is mid-code-block.

      const defaultEval = repl.eval;

      function wrappedDefaultEval(code, context, file, callback) {
        if (Package.ecmascript) {
          try {
            code = Package.ecmascript.ECMAScript.compileForShell(code, {
              cacheDirectory: getCacheDirectory(shellDir)
            });
          } catch (err) {// Any Babel error here might be just fine since it's
            // possible the code was incomplete (multi-line code on the REPL).
            // The defaultEval below will use its own functionality to determine
            // if this error is "recoverable".
          }
        }

        evalCommandPromise.then(() => defaultEval(code, context, file, callback)).catch(callback);
      } // Have the REPL use the newly wrapped function instead and store the
      // _wrappedDefaultEval so that evalulateAndExit calls can use it directly.


      repl.eval = this._wrappedDefaultEval = wrappedDefaultEval;
    }

    enableInteractiveMode(options) {
      // History persists across shell sessions!
      this.initializeHistory();
      const repl = this.repl; // Implement an alternate means of fetching the return value,
      // via `__` (double underscore) as originally implemented in:
      // https://github.com/meteor/meteor/commit/2443d832265c7d1c

      Object.defineProperty(repl.context, "__", {
        get: () => repl.last,
        set: val => {
          repl.last = val;
        },
        // Allow this property to be (re)defined more than once (e.g. each
        // time the server restarts).
        configurable: true
      }); // Some improvements to the existing help messages.

      function addHelp(cmd, helpText) {
        const info = repl.commands[cmd] || repl.commands["." + cmd];

        if (info) {
          info.help = helpText;
        }
      }

      addHelp("break", "Terminate current command input and display new prompt");
      addHelp("exit", "Disconnect from server and leave shell");
      addHelp("help", "Show this help information"); // When the REPL exits, signal the attached client to exit by sending it
      // the special EXITING_MESSAGE.

      repl.on("exit", function () {
        if (options.output) {
          options.output.write(EXITING_MESSAGE + "\n");
          options.output.end();
        }
      }); // When the server process exits, end the output stream but do not
      // signal the attached client to exit.

      process.on("exit", function () {
        if (options.output) {
          options.output.end();
        }
      }); // This Meteor-specific shell command rebuilds the application as if a
      // change was made to server code.

      repl.defineCommand("reload", {
        help: "Restart the server and the shell",
        action: function () {
          process.exit(0);
        }
      });
    } // This function allows a persistent history of shell commands to be saved
    // to and loaded from .meteor/local/shell-history.


    initializeHistory() {
      const rli = this.repl.rli;
      const historyFile = getHistoryFile(this.shellDir);
      let historyFd = openSync(historyFile, "a+");
      const historyLines = readFileSync(historyFile, "utf8").split("\n");
      const seenLines = Object.create(null);

      if (!rli.history) {
        rli.history = [];
        rli.historyIndex = -1;
      }

      while (rli.history && historyLines.length > 0) {
        const line = historyLines.pop();

        if (line && /\S/.test(line) && !seenLines[line]) {
          rli.history.push(line);
          seenLines[line] = true;
        }
      }

      rli.addListener("line", function (line) {
        if (historyFd >= 0 && /\S/.test(line)) {
          writeSync(historyFd, line + "\n");
        }
      });
      this.repl.on("exit", function () {
        closeSync(historyFd);
        historyFd = -1;
      });
    }

  }

  function readJSONFromStream(inputStream, callback) {
    const outputStream = new PassThrough();
    let dataSoFar = "";

    function onData(buffer) {
      const lines = buffer.toString("utf8").split("\n");

      while (lines.length > 0) {
        dataSoFar += lines.shift();
        let json;

        try {
          json = JSON.parse(dataSoFar);
        } catch (error) {
          if (error instanceof SyntaxError) {
            continue;
          }

          return finish(error);
        }

        if (lines.length > 0) {
          outputStream.write(lines.join("\n"));
        }

        inputStream.pipe(outputStream);
        return finish(null, json);
      }
    }

    function onClose() {
      finish(new Error("stream unexpectedly closed"));
    }

    let finished = false;

    function finish(error, json) {
      if (!finished) {
        finished = true;
        inputStream.removeListener("data", onData);
        inputStream.removeListener("error", finish);
        inputStream.removeListener("close", onClose);
        callback(error, json, outputStream);
      }
    }

    inputStream.on("data", onData);
    inputStream.on("error", finish);
    inputStream.on("close", onClose);
  }

  function getInfoFile(shellDir) {
    return pathJoin(shellDir, "info.json");
  }

  function getHistoryFile(shellDir) {
    return pathJoin(shellDir, "history");
  }

  function getCacheDirectory(shellDir) {
    return pathJoin(shellDir, "cache");
  }

  function setRequireAndModule(context) {
    if (Package.modules) {
      // Use the same `require` function and `module` object visible to the
      // application.
      const toBeInstalled = {};
      const shellModuleName = "meteor-shell-" + Math.random().toString(36).slice(2) + ".js";

      toBeInstalled[shellModuleName] = function (require, exports, module) {
        context.module = module;
        context.require = require; // Tab completion sometimes uses require.extensions, but only for
        // the keys.

        require.extensions = {
          ".js": true,
          ".json": true,
          ".node": true
        };
      }; // This populates repl.context.{module,require} by evaluating the
      // module defined above.


      Package.modules.meteorInstall(toBeInstalled)("./" + shellModuleName);
    }
  }
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/shell-server/main.js");

/* Exports */
Package._define("shell-server", exports);

})();

//# sourceURL=meteor://💻app/packages/shell-server.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc2hlbGwtc2VydmVyL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NoZWxsLXNlcnZlci9zaGVsbC1zZXJ2ZXIuanMiXSwibmFtZXMiOlsibW9kdWxlIiwibGluayIsImxpc3RlbiIsInYiLCJzaGVsbERpciIsInByb2Nlc3MiLCJlbnYiLCJNRVRFT1JfU0hFTExfRElSIiwibW9kdWxlMSIsImV4cG9ydCIsImRpc2FibGUiLCJhc3NlcnQiLCJkZWZhdWx0IiwicGF0aEpvaW4iLCJqb2luIiwiUGFzc1Rocm91Z2giLCJjbG9zZVN5bmMiLCJvcGVuU3luYyIsInJlYWRGaWxlU3luYyIsInVubGluayIsIndyaXRlRmlsZVN5bmMiLCJ3cml0ZVN5bmMiLCJjcmVhdGVTZXJ2ZXIiLCJyZXBsU3RhcnQiLCJzdGFydCIsIklORk9fRklMRV9NT0RFIiwicGFyc2VJbnQiLCJFWElUSU5HX01FU1NBR0UiLCJjYWxsYmFjayIsIlNlcnZlciIsIk1ldGVvciIsInN0YXJ0dXAiLCJfX21ldGVvcl9ib290c3RyYXBfXyIsImhvb2tzIiwic3RhcnR1cEhvb2tzIiwicHVzaCIsInNldEltbWVkaWF0ZSIsImdldEluZm9GaWxlIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0YXR1cyIsInJlYXNvbiIsIm1vZGUiLCJpZ25vcmVkIiwiZXZhbENvbW1hbmRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjb25zdHJ1Y3RvciIsIm9rIiwia2V5IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic2xpY2UiLCJzZXJ2ZXIiLCJzb2NrZXQiLCJvbkNvbm5lY3Rpb24iLCJvbiIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwiaW5mb0ZpbGUiLCJwb3J0IiwiYWRkcmVzcyIsInRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZW5kIiwicmVhZEpTT05Gcm9tU3RyZWFtIiwib3B0aW9ucyIsInJlcGxJbnB1dFNvY2tldCIsImNsZWFyVGltZW91dCIsImNvbHVtbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJjcmVhdGUiLCJwcm9tcHQiLCJ0ZXJtaW5hbCIsInVzZUNvbG9ycyIsImlnbm9yZVVuZGVmaW5lZCIsImlucHV0IiwidXNlR2xvYmFsIiwib3V0cHV0IiwiZXZhbHVhdGVBbmRFeGl0Iiwic3RhcnRSRVBMIiwiX3dyYXBwZWREZWZhdWx0RXZhbCIsImNhbGwiLCJjb21tYW5kIiwiZ2xvYmFsIiwiZmlsZW5hbWUiLCJyZXN1bHQiLCJzZW5kUmVzdWx0VG9Tb2NrZXQiLCJtZXNzYWdlIiwiY29kZSIsImVuYWJsZUludGVyYWN0aXZlTW9kZSIsInJlcGwiLCJjb250ZXh0Iiwic2V0UmVxdWlyZUFuZE1vZHVsZSIsImRlZmF1bHRFdmFsIiwiZXZhbCIsIndyYXBwZWREZWZhdWx0RXZhbCIsImZpbGUiLCJQYWNrYWdlIiwiZWNtYXNjcmlwdCIsIkVDTUFTY3JpcHQiLCJjb21waWxlRm9yU2hlbGwiLCJjYWNoZURpcmVjdG9yeSIsImdldENhY2hlRGlyZWN0b3J5IiwidGhlbiIsImNhdGNoIiwiaW5pdGlhbGl6ZUhpc3RvcnkiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImxhc3QiLCJzZXQiLCJ2YWwiLCJjb25maWd1cmFibGUiLCJhZGRIZWxwIiwiY21kIiwiaGVscFRleHQiLCJpbmZvIiwiY29tbWFuZHMiLCJoZWxwIiwid3JpdGUiLCJkZWZpbmVDb21tYW5kIiwiYWN0aW9uIiwiZXhpdCIsInJsaSIsImhpc3RvcnlGaWxlIiwiZ2V0SGlzdG9yeUZpbGUiLCJoaXN0b3J5RmQiLCJoaXN0b3J5TGluZXMiLCJzcGxpdCIsInNlZW5MaW5lcyIsImhpc3RvcnkiLCJoaXN0b3J5SW5kZXgiLCJsZW5ndGgiLCJsaW5lIiwicG9wIiwidGVzdCIsImFkZExpc3RlbmVyIiwiaW5wdXRTdHJlYW0iLCJvdXRwdXRTdHJlYW0iLCJkYXRhU29GYXIiLCJvbkRhdGEiLCJidWZmZXIiLCJsaW5lcyIsInNoaWZ0IiwianNvbiIsInBhcnNlIiwiU3ludGF4RXJyb3IiLCJmaW5pc2giLCJwaXBlIiwib25DbG9zZSIsIkVycm9yIiwiZmluaXNoZWQiLCJyZW1vdmVMaXN0ZW5lciIsIm1vZHVsZXMiLCJ0b0JlSW5zdGFsbGVkIiwic2hlbGxNb2R1bGVOYW1lIiwicmVxdWlyZSIsImV4cG9ydHMiLCJleHRlbnNpb25zIiwibWV0ZW9ySW5zdGFsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUMsT0FBSTtBQUFMLENBQWhDLEVBQTBDLENBQTFDO0FBQTZDLElBQUlDLE1BQUo7QUFBV0YsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ0MsUUFBTSxDQUFDQyxDQUFELEVBQUc7QUFBQ0QsVUFBTSxHQUFDQyxDQUFQO0FBQVM7O0FBQXBCLENBQWhDLEVBQXNELENBQXREO0FBR3hELE1BQU1DLFFBQVEsR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGdCQUE3Qjs7QUFDQSxJQUFJSCxRQUFKLEVBQWM7QUFDWkYsUUFBTSxDQUFDRSxRQUFELENBQU47QUFDRCxDOzs7Ozs7Ozs7Ozs7QUNOREksU0FBTyxDQUFDQyxNQUFSLENBQWU7QUFBQ1AsVUFBTSxFQUFDLE1BQUlBLE1BQVo7QUFBbUJRLFdBQU8sRUFBQyxNQUFJQTtBQUEvQixHQUFmO0FBQXdELE1BQUlDLE1BQUo7QUFBV0gsU0FBTyxDQUFDUCxJQUFSLENBQWEsUUFBYixFQUFzQjtBQUFDVyxXQUFPLENBQUNULENBQUQsRUFBRztBQUFDUSxZQUFNLEdBQUNSLENBQVA7QUFBUzs7QUFBckIsR0FBdEIsRUFBNkMsQ0FBN0M7QUFBZ0QsTUFBSVUsUUFBSjtBQUFhTCxTQUFPLENBQUNQLElBQVIsQ0FBYSxNQUFiLEVBQW9CO0FBQUNhLFFBQUksQ0FBQ1gsQ0FBRCxFQUFHO0FBQUNVLGNBQVEsR0FBQ1YsQ0FBVDtBQUFXOztBQUFwQixHQUFwQixFQUEwQyxD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QU8sQ0FBQ3VELE9BQVIsQ0FBZ0JNLGFBQWhCLENBQThCTCxhQUE5QixFQUE2QyxPQUFPQyxlQUFwRDtBQUNEO0FBQ0YiLCJmaWxlIjoiL3BhY2thZ2VzL3NoZWxsLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gXCIuL3NoZWxsLXNlcnZlci5qc1wiO1xuaW1wb3J0IHsgbGlzdGVuIH0gZnJvbSBcIi4vc2hlbGwtc2VydmVyLmpzXCI7XG5cbmNvbnN0IHNoZWxsRGlyID0gcHJvY2Vzcy5lbnYuTUVURU9SX1NIRUxMX0RJUjtcbmlmIChzaGVsbERpcikge1xuICBsaXN0ZW4oc2hlbGxEaXIpO1xufVxuIiwiaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBqb2luIGFzIHBhdGhKb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0IHtcbiAgY2xvc2VTeW5jLFxuICBvcGVuU3luYyxcbiAgcmVhZEZpbGVTeW5jLFxuICB1bmxpbmssXG4gIHdyaXRlRmlsZVN5bmMsXG4gIHdyaXRlU3luYyxcbn0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tIFwibmV0XCI7XG5pbXBvcnQgeyBzdGFydCBhcyByZXBsU3RhcnQgfSBmcm9tIFwicmVwbFwiO1xuXG5jb25zdCBJTkZPX0ZJTEVfTU9ERSA9IHBhcnNlSW50KFwiNjAwXCIsIDgpOyAvLyBPbmx5IHRoZSBvd25lciBjYW4gcmVhZCBvciB3cml0ZS5cbmNvbnN0IEVYSVRJTkdfTUVTU0FHRSA9IFwiU2hlbGwgZXhpdGluZy4uLlwiO1xuXG4vLyBJbnZva2VkIGJ5IHRoZSBzZXJ2ZXIgcHJvY2VzcyB0byBsaXN0ZW4gZm9yIGluY29taW5nIGNvbm5lY3Rpb25zIGZyb21cbi8vIHNoZWxsIGNsaWVudHMuIEVhY2ggY29ubmVjdGlvbiBnZXRzIGl0cyBvd24gUkVQTCBpbnN0YW5jZS5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW4oc2hlbGxEaXIpIHtcbiAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgbmV3IFNlcnZlcihzaGVsbERpcikubGlzdGVuKCk7XG4gIH1cblxuICAvLyBJZiB0aGUgc2VydmVyIGlzIHN0aWxsIGluIHRoZSB2ZXJ5IGVhcmx5IHN0YWdlcyBvZiBzdGFydGluZyB1cCxcbiAgLy8gTWV0ZW9yLnN0YXJ0dXAgbWF5IG5vdCBhdmFpbGFibGUgeWV0LlxuICBpZiAodHlwZW9mIE1ldGVvciA9PT0gXCJvYmplY3RcIikge1xuICAgIE1ldGVvci5zdGFydHVwKGNhbGxiYWNrKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgX19tZXRlb3JfYm9vdHN0cmFwX18gPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBob29rcyA9IF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnN0YXJ0dXBIb29rcztcbiAgICBpZiAoaG9va3MpIHtcbiAgICAgIGhvb2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBcyBhIGZhbGxiYWNrLCBqdXN0IGNhbGwgdGhlIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5LlxuICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gRGlzYWJsaW5nIHRoZSBzaGVsbCBjYXVzZXMgYWxsIGF0dGFjaGVkIGNsaWVudHMgdG8gZGlzY29ubmVjdCBhbmQgZXhpdC5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlKHNoZWxsRGlyKSB7XG4gIHRyeSB7XG4gICAgLy8gUmVwbGFjZSBpbmZvLmpzb24gd2l0aCBhIGZpbGUgdGhhdCBzYXlzIHRoZSBzaGVsbCBzZXJ2ZXIgaXNcbiAgICAvLyBkaXNhYmxlZCwgc28gdGhhdCBhbnkgY29ubmVjdGVkIHNoZWxsIGNsaWVudHMgd2lsbCBmYWlsIHRvXG4gICAgLy8gcmVjb25uZWN0IGFmdGVyIHRoZSBzZXJ2ZXIgcHJvY2VzcyBjbG9zZXMgdGhlaXIgc29ja2V0cy5cbiAgICB3cml0ZUZpbGVTeW5jKFxuICAgICAgZ2V0SW5mb0ZpbGUoc2hlbGxEaXIpLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzdGF0dXM6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgcmVhc29uOiBcIlNoZWxsIHNlcnZlciBoYXMgc2h1dCBkb3duLlwiXG4gICAgICB9KSArIFwiXFxuXCIsXG4gICAgICB7IG1vZGU6IElORk9fRklMRV9NT0RFIH1cbiAgICApO1xuICB9IGNhdGNoIChpZ25vcmVkKSB7fVxufVxuXG4vLyBTaGVsbCBjb21tYW5kcyBuZWVkIHRvIGJlIGV4ZWN1dGVkIGluIGEgRmliZXIgaW4gY2FzZSB0aGV5IGNhbGwgaW50b1xuLy8gY29kZSB0aGF0IHlpZWxkcy4gVXNpbmcgYSBQcm9taXNlIGlzIGFuIGV2ZW4gYmV0dGVyIGlkZWEsIHNpbmNlIGl0IHJ1bnNcbi8vIGl0cyBjYWxsYmFja3MgaW4gRmliZXJzIGRyYXduIGZyb20gYSBwb29sLCBzbyB0aGUgRmliZXJzIGFyZSByZWN5Y2xlZC5cbmNvbnN0IGV2YWxDb21tYW5kUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuXG5jbGFzcyBTZXJ2ZXIge1xuICBjb25zdHJ1Y3RvcihzaGVsbERpcikge1xuICAgIGFzc2VydC5vayh0aGlzIGluc3RhbmNlb2YgU2VydmVyKTtcblxuICAgIHRoaXMuc2hlbGxEaXIgPSBzaGVsbERpcjtcbiAgICB0aGlzLmtleSA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPVxuICAgICAgY3JlYXRlU2VydmVyKChzb2NrZXQpID0+IHtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Rpb24oc29ja2V0KTtcbiAgICAgIH0pXG4gICAgICAub24oXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbGlzdGVuKCkge1xuICAgIGNvbnN0IGluZm9GaWxlID0gZ2V0SW5mb0ZpbGUodGhpcy5zaGVsbERpcik7XG5cbiAgICB1bmxpbmsoaW5mb0ZpbGUsICgpID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLmxpc3RlbigwLCBcIjEyNy4wLjAuMVwiLCAoKSA9PiB7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoaW5mb0ZpbGUsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzdGF0dXM6IFwiZW5hYmxlZFwiLFxuICAgICAgICAgIHBvcnQ6IHRoaXMuc2VydmVyLmFkZHJlc3MoKS5wb3J0LFxuICAgICAgICAgIGtleTogdGhpcy5rZXlcbiAgICAgICAgfSkgKyBcIlxcblwiLCB7XG4gICAgICAgICAgbW9kZTogSU5GT19GSUxFX01PREVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ29ubmVjdGlvbihzb2NrZXQpIHtcbiAgICAvLyBNYWtlIHN1cmUgdGhpcyBmdW5jdGlvbiBkb2Vzbid0IHRyeSB0byB3cml0ZSBhbnl0aGluZyB0byB0aGUgc29ja2V0XG4gICAgLy8gYWZ0ZXIgaXQgaGFzIGJlZW4gY2xvc2VkLlxuICAgIHNvY2tldC5vbihcImNsb3NlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc29ja2V0ID0gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIElmIGNvbW11bmljYXRpb24gaXMgbm90IGVzdGFibGlzaGVkIHdpdGhpbiAxMDAwbXMgb2YgdGhlIGZpcnN0XG4gICAgLy8gY29ubmVjdGlvbiwgZm9yY2libHkgY2xvc2UgdGhlIHNvY2tldC5cbiAgICBjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzb2NrZXQpIHtcbiAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycyhcImRhdGFcIik7XG4gICAgICAgIHNvY2tldC5lbmQoRVhJVElOR19NRVNTQUdFICsgXCJcXG5cIik7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICAvLyBMZXQgY29ubmVjdGluZyBjbGllbnRzIGNvbmZpZ3VyZSBjZXJ0YWluIFJFUEwgb3B0aW9ucyBieSBzZW5kaW5nIGFcbiAgICAvLyBKU09OIG9iamVjdCBvdmVyIHRoZSBzb2NrZXQuIEZvciBleGFtcGxlLCBvbmx5IHRoZSBjbGllbnQga25vd3NcbiAgICAvLyB3aGV0aGVyIGl0J3MgcnVubmluZyBhIFRUWSBvciBhbiBFbWFjcyBzdWJzaGVsbCBvciBzb21lIG90aGVyIGtpbmQgb2ZcbiAgICAvLyB0ZXJtaW5hbCwgc28gdGhlIGNsaWVudCBtdXN0IGRlY2lkZSB0aGUgdmFsdWUgb2Ygb3B0aW9ucy50ZXJtaW5hbC5cbiAgICByZWFkSlNPTkZyb21TdHJlYW0oc29ja2V0LCAoZXJyb3IsIG9wdGlvbnMsIHJlcGxJbnB1dFNvY2tldCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgc29ja2V0ID0gbnVsbDtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMua2V5ICE9PSB0aGlzLmtleSkge1xuICAgICAgICBpZiAoc29ja2V0KSB7XG4gICAgICAgICAgc29ja2V0LmVuZChFWElUSU5HX01FU1NBR0UgKyBcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkZWxldGUgb3B0aW9ucy5rZXk7XG5cbiAgICAgIC8vIFNldCB0aGUgY29sdW1ucyB0byB3aGF0IGlzIGJlaW5nIHJlcXVlc3RlZCBieSB0aGUgY2xpZW50LlxuICAgICAgaWYgKG9wdGlvbnMuY29sdW1ucyAmJiBzb2NrZXQpIHtcbiAgICAgICAgc29ja2V0LmNvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnM7XG4gICAgICB9XG4gICAgICBkZWxldGUgb3B0aW9ucy5jb2x1bW5zO1xuXG4gICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAgICAgICAvLyBEZWZhdWx0cyBmb3IgY29uZmlndXJhYmxlIG9wdGlvbnMuXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9tcHQ6IFwiPiBcIixcbiAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICB1c2VDb2xvcnM6IHRydWUsXG4gICAgICAgICAgaWdub3JlVW5kZWZpbmVkOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIENvbmZpZ3VyYWJsZSBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMsXG5cbiAgICAgICAgLy8gSW1tdXRhYmxlIG9wdGlvbnMuXG4gICAgICAgIHtcbiAgICAgICAgICBpbnB1dDogcmVwbElucHV0U29ja2V0LFxuICAgICAgICAgIHVzZUdsb2JhbDogZmFsc2UsXG4gICAgICAgICAgb3V0cHV0OiBzb2NrZXRcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgLy8gVGhlIHByb21wdCBkdXJpbmcgYW4gZXZhbHVhdGVBbmRFeGl0IG11c3QgYmUgYmxhbmsgdG8gZW5zdXJlXG4gICAgICAvLyB0aGF0IHRoZSBwcm9tcHQgZG9lc24ndCBpbmFkdmVydGVudGx5IGdldCBwYXJzZWQgYXMgcGFydCBvZlxuICAgICAgLy8gdGhlIEpTT04gY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICAgICAgaWYgKG9wdGlvbnMuZXZhbHVhdGVBbmRFeGl0KSB7XG4gICAgICAgIG9wdGlvbnMucHJvbXB0ID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgLy8gU3RhcnQgdGhlIFJFUEwuXG4gICAgICB0aGlzLnN0YXJ0UkVQTChvcHRpb25zKTtcblxuICAgICAgaWYgKG9wdGlvbnMuZXZhbHVhdGVBbmRFeGl0KSB7XG4gICAgICAgIHRoaXMuX3dyYXBwZWREZWZhdWx0RXZhbC5jYWxsKFxuICAgICAgICAgIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICAgICAgb3B0aW9ucy5ldmFsdWF0ZUFuZEV4aXQuY29tbWFuZCxcbiAgICAgICAgICBnbG9iYWwsXG4gICAgICAgICAgb3B0aW9ucy5ldmFsdWF0ZUFuZEV4aXQuZmlsZW5hbWUgfHwgXCI8bWV0ZW9yIHNoZWxsPlwiLFxuICAgICAgICAgIGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoc29ja2V0KSB7XG4gICAgICAgICAgICAgIGZ1bmN0aW9uIHNlbmRSZXN1bHRUb1NvY2tldChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VuZGluZyBiYWNrIGEgSlNPTiBwYXlsb2FkIGFsbG93cyB0aGUgY2xpZW50IHRvXG4gICAgICAgICAgICAgICAgLy8gZGlzdGluZ3Vpc2ggYmV0d2VlbiBlcnJvcnMgYW5kIHN1Y2Nlc3NmdWwgcmVzdWx0cy5cbiAgICAgICAgICAgICAgICBzb2NrZXQuZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpICsgXCJcXG5cIik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzZW5kUmVzdWx0VG9Tb2NrZXQoe1xuICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICBjb2RlOiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3VsdFRvU29ja2V0KHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGVsZXRlIG9wdGlvbnMuZXZhbHVhdGVBbmRFeGl0O1xuXG4gICAgICB0aGlzLmVuYWJsZUludGVyYWN0aXZlTW9kZShvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0UkVQTChvcHRpb25zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHRoaXMgZnVuY3Rpb24gZG9lc24ndCB0cnkgdG8gd3JpdGUgYW55dGhpbmcgdG8gdGhlIG91dHB1dFxuICAgIC8vIHN0cmVhbSBhZnRlciBpdCBoYXMgYmVlbiBjbG9zZWQuXG4gICAgb3B0aW9ucy5vdXRwdXQub24oXCJjbG9zZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIG9wdGlvbnMub3V0cHV0ID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlcGwgPSB0aGlzLnJlcGwgPSByZXBsU3RhcnQob3B0aW9ucyk7XG4gICAgY29uc3QgeyBzaGVsbERpciB9ID0gdGhpcztcblxuICAgIC8vIFRoaXMgaXMgdGVjaG5pcXVlIG9mIHNldHRpbmcgYHJlcGwuY29udGV4dGAgaXMgc2ltaWxhciB0byBob3cgdGhlXG4gICAgLy8gYHVzZUdsb2JhbGAgb3B0aW9uIHdvdWxkIHdvcmsgZHVyaW5nIGEgbm9ybWFsIGByZXBsLnN0YXJ0KClgIGFuZFxuICAgIC8vIGFsbG93cyBzaGVsbCBhY2Nlc3MgKGFuZCB0YWIgY29tcGxldGlvbiEpIHRvIE1ldGVvciBnbG9iYWxzIChpLmUuXG4gICAgLy8gVW5kZXJzY29yZSBfLCBNZXRlb3IsIGV0Yy4pLiBCeSB1c2luZyB0aGlzIHRlY2huaXF1ZSwgd2hpY2ggY2hhbmdlc1xuICAgIC8vIHRoZSBjb250ZXh0IGFmdGVyIHN0YXJ0dXAsIHdlIGF2b2lkIHN0b21waW5nIG9uIHRoZSBzcGVjaWFsIGBfYFxuICAgIC8vIHZhcmlhYmxlIChpbiBgcmVwbGAgdGhpcyBlcXVhbHMgdGhlIHZhbHVlIG9mIHRoZSBsYXN0IGNvbW1hbmQpIGZyb21cbiAgICAvLyBiZWluZyBvdmVycmlkZGVuIGluIHRoZSBjbGllbnQvc2VydmVyIHNvY2tldC1oYW5kc2hha2luZy4gIEZ1cnRoZXJtb3JlLFxuICAgIC8vIGJ5IHNldHRpbmcgYHVzZUdsb2JhbGAgYmFjayB0byB0cnVlLCB3ZSBhbGxvdyB0aGUgZGVmYXVsdCBldmFsIGZ1bmN0aW9uXG4gICAgLy8gdG8gdXNlIHRoZSBkZXNpcmVkIGBydW5JblRoaXNDb250ZXh0YCBtZXRob2QgKGh0dHBzOi8vZ2l0LmlvL3ZidkFCKS5cbiAgICByZXBsLmNvbnRleHQgPSBnbG9iYWw7XG4gICAgcmVwbC51c2VHbG9iYWwgPSB0cnVlO1xuXG4gICAgc2V0UmVxdWlyZUFuZE1vZHVsZShyZXBsLmNvbnRleHQpO1xuXG4gICAgLy8gSW4gb3JkZXIgdG8gYXZvaWQgZHVwbGljYXRpbmcgY29kZSBoZXJlLCBzcGVjaWZpY2FsbHkgdGhlIGNvbXBsZXhpdGllc1xuICAgIC8vIG9mIGNhdGNoaW5nIHNvLWNhbGxlZCBcIlJlY292ZXJhYmxlIEVycm9yc1wiIChodHRwczovL2dpdC5pby92YnZibCksXG4gICAgLy8gd2Ugd2lsbCB3cmFwIHRoZSBkZWZhdWx0IGV2YWwsIHJ1biBpdCBpbiBhIEZpYmVyICh2aWEgYSBQcm9taXNlKSwgYW5kXG4gICAgLy8gZ2l2ZSBpdCB0aGUgb3Bwb3J0dW5pdHkgdG8gZGVjaWRlIGlmIHRoZSB1c2VyIGlzIG1pZC1jb2RlLWJsb2NrLlxuICAgIGNvbnN0IGRlZmF1bHRFdmFsID0gcmVwbC5ldmFsO1xuXG4gICAgZnVuY3Rpb24gd3JhcHBlZERlZmF1bHRFdmFsKGNvZGUsIGNvbnRleHQsIGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoUGFja2FnZS5lY21hc2NyaXB0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29kZSA9IFBhY2thZ2UuZWNtYXNjcmlwdC5FQ01BU2NyaXB0LmNvbXBpbGVGb3JTaGVsbChjb2RlLCB7XG4gICAgICAgICAgICBjYWNoZURpcmVjdG9yeTogZ2V0Q2FjaGVEaXJlY3Rvcnkoc2hlbGxEaXIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIEFueSBCYWJlbCBlcnJvciBoZXJlIG1pZ2h0IGJlIGp1c3QgZmluZSBzaW5jZSBpdCdzXG4gICAgICAgICAgLy8gcG9zc2libGUgdGhlIGNvZGUgd2FzIGluY29tcGxldGUgKG11bHRpLWxpbmUgY29kZSBvbiB0aGUgUkVQTCkuXG4gICAgICAgICAgLy8gVGhlIGRlZmF1bHRFdmFsIGJlbG93IHdpbGwgdXNlIGl0cyBvd24gZnVuY3Rpb25hbGl0eSB0byBkZXRlcm1pbmVcbiAgICAgICAgICAvLyBpZiB0aGlzIGVycm9yIGlzIFwicmVjb3ZlcmFibGVcIi5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldmFsQ29tbWFuZFByb21pc2VcbiAgICAgICAgLnRoZW4oKCkgPT4gZGVmYXVsdEV2YWwoY29kZSwgY29udGV4dCwgZmlsZSwgY2FsbGJhY2spKVxuICAgICAgICAuY2F0Y2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIEhhdmUgdGhlIFJFUEwgdXNlIHRoZSBuZXdseSB3cmFwcGVkIGZ1bmN0aW9uIGluc3RlYWQgYW5kIHN0b3JlIHRoZVxuICAgIC8vIF93cmFwcGVkRGVmYXVsdEV2YWwgc28gdGhhdCBldmFsdWxhdGVBbmRFeGl0IGNhbGxzIGNhbiB1c2UgaXQgZGlyZWN0bHkuXG4gICAgcmVwbC5ldmFsID0gdGhpcy5fd3JhcHBlZERlZmF1bHRFdmFsID0gd3JhcHBlZERlZmF1bHRFdmFsO1xuICB9XG5cbiAgZW5hYmxlSW50ZXJhY3RpdmVNb2RlKG9wdGlvbnMpIHtcbiAgICAvLyBIaXN0b3J5IHBlcnNpc3RzIGFjcm9zcyBzaGVsbCBzZXNzaW9ucyFcbiAgICB0aGlzLmluaXRpYWxpemVIaXN0b3J5KCk7XG5cbiAgICBjb25zdCByZXBsID0gdGhpcy5yZXBsO1xuXG4gICAgLy8gSW1wbGVtZW50IGFuIGFsdGVybmF0ZSBtZWFucyBvZiBmZXRjaGluZyB0aGUgcmV0dXJuIHZhbHVlLFxuICAgIC8vIHZpYSBgX19gIChkb3VibGUgdW5kZXJzY29yZSkgYXMgb3JpZ2luYWxseSBpbXBsZW1lbnRlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9jb21taXQvMjQ0M2Q4MzIyNjVjN2QxY1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXBsLmNvbnRleHQsIFwiX19cIiwge1xuICAgICAgZ2V0OiAoKSA9PiByZXBsLmxhc3QsXG4gICAgICBzZXQ6ICh2YWwpID0+IHtcbiAgICAgICAgcmVwbC5sYXN0ID0gdmFsO1xuICAgICAgfSxcblxuICAgICAgLy8gQWxsb3cgdGhpcyBwcm9wZXJ0eSB0byBiZSAocmUpZGVmaW5lZCBtb3JlIHRoYW4gb25jZSAoZS5nLiBlYWNoXG4gICAgICAvLyB0aW1lIHRoZSBzZXJ2ZXIgcmVzdGFydHMpLlxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBTb21lIGltcHJvdmVtZW50cyB0byB0aGUgZXhpc3RpbmcgaGVscCBtZXNzYWdlcy5cbiAgICBmdW5jdGlvbiBhZGRIZWxwKGNtZCwgaGVscFRleHQpIHtcbiAgICAgIGNvbnN0IGluZm8gPSByZXBsLmNvbW1hbmRzW2NtZF0gfHwgcmVwbC5jb21tYW5kc1tcIi5cIiArIGNtZF07XG4gICAgICBpZiAoaW5mbykge1xuICAgICAgICBpbmZvLmhlbHAgPSBoZWxwVGV4dDtcbiAgICAgIH1cbiAgICB9XG4gICAgYWRkSGVscChcImJyZWFrXCIsIFwiVGVybWluYXRlIGN1cnJlbnQgY29tbWFuZCBpbnB1dCBhbmQgZGlzcGxheSBuZXcgcHJvbXB0XCIpO1xuICAgIGFkZEhlbHAoXCJleGl0XCIsIFwiRGlzY29ubmVjdCBmcm9tIHNlcnZlciBhbmQgbGVhdmUgc2hlbGxcIik7XG4gICAgYWRkSGVscChcImhlbHBcIiwgXCJTaG93IHRoaXMgaGVscCBpbmZvcm1hdGlvblwiKTtcblxuICAgIC8vIFdoZW4gdGhlIFJFUEwgZXhpdHMsIHNpZ25hbCB0aGUgYXR0YWNoZWQgY2xpZW50IHRvIGV4aXQgYnkgc2VuZGluZyBpdFxuICAgIC8vIHRoZSBzcGVjaWFsIEVYSVRJTkdfTUVTU0FHRS5cbiAgICByZXBsLm9uKFwiZXhpdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRpb25zLm91dHB1dCkge1xuICAgICAgICBvcHRpb25zLm91dHB1dC53cml0ZShFWElUSU5HX01FU1NBR0UgKyBcIlxcblwiKTtcbiAgICAgICAgb3B0aW9ucy5vdXRwdXQuZW5kKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBXaGVuIHRoZSBzZXJ2ZXIgcHJvY2VzcyBleGl0cywgZW5kIHRoZSBvdXRwdXQgc3RyZWFtIGJ1dCBkbyBub3RcbiAgICAvLyBzaWduYWwgdGhlIGF0dGFjaGVkIGNsaWVudCB0byBleGl0LlxuICAgIHByb2Nlc3Mub24oXCJleGl0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG9wdGlvbnMub3V0cHV0KSB7XG4gICAgICAgIG9wdGlvbnMub3V0cHV0LmVuZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBNZXRlb3Itc3BlY2lmaWMgc2hlbGwgY29tbWFuZCByZWJ1aWxkcyB0aGUgYXBwbGljYXRpb24gYXMgaWYgYVxuICAgIC8vIGNoYW5nZSB3YXMgbWFkZSB0byBzZXJ2ZXIgY29kZS5cbiAgICByZXBsLmRlZmluZUNvbW1hbmQoXCJyZWxvYWRcIiwge1xuICAgICAgaGVscDogXCJSZXN0YXJ0IHRoZSBzZXJ2ZXIgYW5kIHRoZSBzaGVsbFwiLFxuICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgYSBwZXJzaXN0ZW50IGhpc3Rvcnkgb2Ygc2hlbGwgY29tbWFuZHMgdG8gYmUgc2F2ZWRcbiAgLy8gdG8gYW5kIGxvYWRlZCBmcm9tIC5tZXRlb3IvbG9jYWwvc2hlbGwtaGlzdG9yeS5cbiAgaW5pdGlhbGl6ZUhpc3RvcnkoKSB7XG4gICAgY29uc3QgcmxpID0gdGhpcy5yZXBsLnJsaTtcbiAgICBjb25zdCBoaXN0b3J5RmlsZSA9IGdldEhpc3RvcnlGaWxlKHRoaXMuc2hlbGxEaXIpO1xuICAgIGxldCBoaXN0b3J5RmQgPSBvcGVuU3luYyhoaXN0b3J5RmlsZSwgXCJhK1wiKTtcbiAgICBjb25zdCBoaXN0b3J5TGluZXMgPSByZWFkRmlsZVN5bmMoaGlzdG9yeUZpbGUsIFwidXRmOFwiKS5zcGxpdChcIlxcblwiKTtcbiAgICBjb25zdCBzZWVuTGluZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgaWYgKCEgcmxpLmhpc3RvcnkpIHtcbiAgICAgIHJsaS5oaXN0b3J5ID0gW107XG4gICAgICBybGkuaGlzdG9yeUluZGV4ID0gLTE7XG4gICAgfVxuXG4gICAgd2hpbGUgKHJsaS5oaXN0b3J5ICYmIGhpc3RvcnlMaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBsaW5lID0gaGlzdG9yeUxpbmVzLnBvcCgpO1xuICAgICAgaWYgKGxpbmUgJiYgL1xcUy8udGVzdChsaW5lKSAmJiAhIHNlZW5MaW5lc1tsaW5lXSkge1xuICAgICAgICBybGkuaGlzdG9yeS5wdXNoKGxpbmUpO1xuICAgICAgICBzZWVuTGluZXNbbGluZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJsaS5hZGRMaXN0ZW5lcihcImxpbmVcIiwgZnVuY3Rpb24obGluZSkge1xuICAgICAgaWYgKGhpc3RvcnlGZCA+PSAwICYmIC9cXFMvLnRlc3QobGluZSkpIHtcbiAgICAgICAgd3JpdGVTeW5jKGhpc3RvcnlGZCwgbGluZSArIFwiXFxuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZXBsLm9uKFwiZXhpdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNsb3NlU3luYyhoaXN0b3J5RmQpO1xuICAgICAgaGlzdG9yeUZkID0gLTE7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVhZEpTT05Gcm9tU3RyZWFtKGlucHV0U3RyZWFtLCBjYWxsYmFjaykge1xuICBjb25zdCBvdXRwdXRTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKTtcbiAgbGV0IGRhdGFTb0ZhciA9IFwiXCI7XG5cbiAgZnVuY3Rpb24gb25EYXRhKGJ1ZmZlcikge1xuICAgIGNvbnN0IGxpbmVzID0gYnVmZmVyLnRvU3RyaW5nKFwidXRmOFwiKS5zcGxpdChcIlxcblwiKTtcblxuICAgIHdoaWxlIChsaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICBkYXRhU29GYXIgKz0gbGluZXMuc2hpZnQoKTtcblxuICAgICAgbGV0IGpzb247XG4gICAgICB0cnkge1xuICAgICAgICBqc29uID0gSlNPTi5wYXJzZShkYXRhU29GYXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5pc2goZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBvdXRwdXRTdHJlYW0ud3JpdGUobGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlucHV0U3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcblxuICAgICAgcmV0dXJuIGZpbmlzaChudWxsLCBqc29uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkNsb3NlKCkge1xuICAgIGZpbmlzaChuZXcgRXJyb3IoXCJzdHJlYW0gdW5leHBlY3RlZGx5IGNsb3NlZFwiKSk7XG4gIH1cblxuICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZmluaXNoKGVycm9yLCBqc29uKSB7XG4gICAgaWYgKCEgZmluaXNoZWQpIHtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIGlucHV0U3RyZWFtLnJlbW92ZUxpc3RlbmVyKFwiZGF0YVwiLCBvbkRhdGEpO1xuICAgICAgaW5wdXRTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLCBmaW5pc2gpO1xuICAgICAgaW5wdXRTdHJlYW0ucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLCBvbkNsb3NlKTtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBqc29uLCBvdXRwdXRTdHJlYW0pO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0U3RyZWFtLm9uKFwiZGF0YVwiLCBvbkRhdGEpO1xuICBpbnB1dFN0cmVhbS5vbihcImVycm9yXCIsIGZpbmlzaCk7XG4gIGlucHV0U3RyZWFtLm9uKFwiY2xvc2VcIiwgb25DbG9zZSk7XG59XG5cbmZ1bmN0aW9uIGdldEluZm9GaWxlKHNoZWxsRGlyKSB7XG4gIHJldHVybiBwYXRoSm9pbihzaGVsbERpciwgXCJpbmZvLmpzb25cIik7XG59XG5cbmZ1bmN0aW9uIGdldEhpc3RvcnlGaWxlKHNoZWxsRGlyKSB7XG4gIHJldHVybiBwYXRoSm9pbihzaGVsbERpciwgXCJoaXN0b3J5XCIpO1xufVxuXG5mdW5jdGlvbiBnZXRDYWNoZURpcmVjdG9yeShzaGVsbERpcikge1xuICByZXR1cm4gcGF0aEpvaW4oc2hlbGxEaXIsIFwiY2FjaGVcIik7XG59XG5cbmZ1bmN0aW9uIHNldFJlcXVpcmVBbmRNb2R1bGUoY29udGV4dCkge1xuICBpZiAoUGFja2FnZS5tb2R1bGVzKSB7XG4gICAgLy8gVXNlIHRoZSBzYW1lIGByZXF1aXJlYCBmdW5jdGlvbiBhbmQgYG1vZHVsZWAgb2JqZWN0IHZpc2libGUgdG8gdGhlXG4gICAgLy8gYXBwbGljYXRpb24uXG4gICAgY29uc3QgdG9CZUluc3RhbGxlZCA9IHt9O1xuICAgIGNvbnN0IHNoZWxsTW9kdWxlTmFtZSA9IFwibWV0ZW9yLXNoZWxsLVwiICtcbiAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpICsgXCIuanNcIjtcblxuICAgIHRvQmVJbnN0YWxsZWRbc2hlbGxNb2R1bGVOYW1lXSA9IGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgIGNvbnRleHQubW9kdWxlID0gbW9kdWxlO1xuICAgICAgY29udGV4dC5yZXF1aXJlID0gcmVxdWlyZTtcblxuICAgICAgLy8gVGFiIGNvbXBsZXRpb24gc29tZXRpbWVzIHVzZXMgcmVxdWlyZS5leHRlbnNpb25zLCBidXQgb25seSBmb3JcbiAgICAgIC8vIHRoZSBrZXlzLlxuICAgICAgcmVxdWlyZS5leHRlbnNpb25zID0ge1xuICAgICAgICBcIi5qc1wiOiB0cnVlLFxuICAgICAgICBcIi5qc29uXCI6IHRydWUsXG4gICAgICAgIFwiLm5vZGVcIjogdHJ1ZSxcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8vIFRoaXMgcG9wdWxhdGVzIHJlcGwuY29udGV4dC57bW9kdWxlLHJlcXVpcmV9IGJ5IGV2YWx1YXRpbmcgdGhlXG4gICAgLy8gbW9kdWxlIGRlZmluZWQgYWJvdmUuXG4gICAgUGFja2FnZS5tb2R1bGVzLm1ldGVvckluc3RhbGwodG9CZUluc3RhbGxlZCkoXCIuL1wiICsgc2hlbGxNb2R1bGVOYW1lKTtcbiAgfVxufVxuIl19
