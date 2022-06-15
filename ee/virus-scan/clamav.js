const net = require('net');
const fs = require('fs');
const Transform = require('stream').Transform;
class ClamAV {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.timeout = 1000;
    }

    async scanStream(readStream) {
        return new Promise((resolve, reject) => {
            let socket = null;
            let connectAttemptTimer = null;
            let replies = [];
            let readFinished = false;

            try {
                socket = net.createConnection({ host: this.host, port: this.port }, () => {
                    socket.write('zINSTREAM\0');

                    readStream.pipe(chunkTransform()).pipe(socket);
                    readStream.on('end', () => {
                        readFinished = true;
                        readStream.destroy();
                    });

                    readStream.on('error', reject);

                });
            } catch (e) {
                throw e;
            }

            socket.setTimeout(this.timeout);
            socket.on('data', (data) => {
                clearTimeout(connectAttemptTimer);

                if (!readStream.isPaused()) {
                    readStream.pause();
                }

                replies.push(data);
            });

            socket.on('end', () => {
                clearTimeout(connectAttemptTimer);
                let reply = Buffer.concat(replies).toString('utf8') || '';
                if (!readFinished) {
                    return reject(new Error('Scan aborted. Reply from server: ' + reply));
                }

                if (reply.startsWith('stream: OK')) {
                    return resolve({ threat: null });
                }

                return resolve({ threat: reply });
            });

            socket.on('error', reject);

            connectAttemptTimer = setTimeout(() => {
                socket.destroy(new Error('Timeout connecting to server.'));
            }, this.timeout);

        });
    }

    scanFile(filePath) {
        let readStream = fs.createReadStream(filePath);
        return this.scanStream(readStream);
    }
}

function chunkTransform() {
    return new Transform({
        transform(chunk, encoding, callback) {
            const length = Buffer.alloc(4);
            length.writeUInt32BE(chunk.length, 0);
            this.push(length);
            this.push(chunk);
            callback();
        },
        flush(callback) {
            const zero = Buffer.alloc(4);
            zero.writeUInt32BE(0, 0);
            this.push(zero);
            callback();
        }
    });
}



module.exports = ClamAV;