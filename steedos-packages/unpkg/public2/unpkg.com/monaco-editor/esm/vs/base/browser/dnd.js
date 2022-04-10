import { Mimes } from '../common/mime.js';
// Common data transfers
export const DataTransfers = {
    /**
     * Application specific resource transfer type
     */
    RESOURCES: 'ResourceURLs',
    /**
     * Browser specific transfer type to download
     */
    DOWNLOAD_URL: 'DownloadURL',
    /**
     * Browser specific transfer type for files
     */
    FILES: 'Files',
    /**
     * Typically transfer type for copy/paste transfers.
     */
    TEXT: Mimes.text,
    /**
     * Application specific terminal transfer type.
     */
    TERMINALS: 'Terminals'
};
export class DragAndDropData {
    constructor(data) {
        this.data = data;
    }
    update() {
        // noop
    }
    getData() {
        return this.data;
    }
}
export const StaticDND = {
    CurrentDragAndDropData: undefined
};
