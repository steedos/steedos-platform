/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export class ViewUserInputEvents {
    constructor(coordinatesConverter) {
        this.onKeyDown = null;
        this.onKeyUp = null;
        this.onContextMenu = null;
        this.onMouseMove = null;
        this.onMouseLeave = null;
        this.onMouseDown = null;
        this.onMouseUp = null;
        this.onMouseDrag = null;
        this.onMouseDrop = null;
        this.onMouseDropCanceled = null;
        this.onMouseWheel = null;
        this._coordinatesConverter = coordinatesConverter;
    }
    emitKeyDown(e) {
        if (this.onKeyDown) {
            this.onKeyDown(e);
        }
    }
    emitKeyUp(e) {
        if (this.onKeyUp) {
            this.onKeyUp(e);
        }
    }
    emitContextMenu(e) {
        if (this.onContextMenu) {
            this.onContextMenu(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseMove(e) {
        if (this.onMouseMove) {
            this.onMouseMove(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseLeave(e) {
        if (this.onMouseLeave) {
            this.onMouseLeave(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseDown(e) {
        if (this.onMouseDown) {
            this.onMouseDown(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseUp(e) {
        if (this.onMouseUp) {
            this.onMouseUp(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseDrag(e) {
        if (this.onMouseDrag) {
            this.onMouseDrag(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseDrop(e) {
        if (this.onMouseDrop) {
            this.onMouseDrop(this._convertViewToModelMouseEvent(e));
        }
    }
    emitMouseDropCanceled() {
        if (this.onMouseDropCanceled) {
            this.onMouseDropCanceled();
        }
    }
    emitMouseWheel(e) {
        if (this.onMouseWheel) {
            this.onMouseWheel(e);
        }
    }
    _convertViewToModelMouseEvent(e) {
        if (e.target) {
            return {
                event: e.event,
                target: this._convertViewToModelMouseTarget(e.target)
            };
        }
        return e;
    }
    _convertViewToModelMouseTarget(target) {
        return ViewUserInputEvents.convertViewToModelMouseTarget(target, this._coordinatesConverter);
    }
    static convertViewToModelMouseTarget(target, coordinatesConverter) {
        const result = Object.assign({}, target);
        if (result.position) {
            result.position = coordinatesConverter.convertViewPositionToModelPosition(result.position);
        }
        if (result.range) {
            result.range = coordinatesConverter.convertViewRangeToModelRange(result.range);
        }
        return result;
    }
}
