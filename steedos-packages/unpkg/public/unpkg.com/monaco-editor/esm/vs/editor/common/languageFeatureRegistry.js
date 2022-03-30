/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../base/common/event.js';
import { toDisposable } from '../../base/common/lifecycle.js';
import { shouldSynchronizeModel } from './model.js';
import { score } from './languageSelector.js';
function isExclusive(selector) {
    if (typeof selector === 'string') {
        return false;
    }
    else if (Array.isArray(selector)) {
        return selector.every(isExclusive);
    }
    else {
        return !!selector.exclusive; // TODO: microsoft/TypeScript#42768
    }
}
export class LanguageFeatureRegistry {
    constructor(_notebookTypeResolver) {
        this._notebookTypeResolver = _notebookTypeResolver;
        this._clock = 0;
        this._entries = [];
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
    }
    register(selector, provider) {
        let entry = {
            selector,
            provider,
            _score: -1,
            _time: this._clock++
        };
        this._entries.push(entry);
        this._lastCandidate = undefined;
        this._onDidChange.fire(this._entries.length);
        return toDisposable(() => {
            if (entry) {
                const idx = this._entries.indexOf(entry);
                if (idx >= 0) {
                    this._entries.splice(idx, 1);
                    this._lastCandidate = undefined;
                    this._onDidChange.fire(this._entries.length);
                    entry = undefined;
                }
            }
        });
    }
    has(model) {
        return this.all(model).length > 0;
    }
    all(model) {
        if (!model) {
            return [];
        }
        this._updateScores(model);
        const result = [];
        // from registry
        for (let entry of this._entries) {
            if (entry._score > 0) {
                result.push(entry.provider);
            }
        }
        return result;
    }
    ordered(model) {
        const result = [];
        this._orderedForEach(model, entry => result.push(entry.provider));
        return result;
    }
    orderedGroups(model) {
        const result = [];
        let lastBucket;
        let lastBucketScore;
        this._orderedForEach(model, entry => {
            if (lastBucket && lastBucketScore === entry._score) {
                lastBucket.push(entry.provider);
            }
            else {
                lastBucketScore = entry._score;
                lastBucket = [entry.provider];
                result.push(lastBucket);
            }
        });
        return result;
    }
    _orderedForEach(model, callback) {
        if (!model) {
            return;
        }
        this._updateScores(model);
        for (const entry of this._entries) {
            if (entry._score > 0) {
                callback(entry);
            }
        }
    }
    _updateScores(model) {
        var _a;
        const notebookType = (_a = this._notebookTypeResolver) === null || _a === void 0 ? void 0 : _a.call(this, model.uri);
        const candidate = {
            uri: model.uri.toString(),
            language: model.getLanguageId(),
            notebookType
        };
        if (this._lastCandidate
            && this._lastCandidate.language === candidate.language
            && this._lastCandidate.uri === candidate.uri
            && this._lastCandidate.notebookType === candidate.notebookType) {
            // nothing has changed
            return;
        }
        this._lastCandidate = candidate;
        for (let entry of this._entries) {
            entry._score = score(entry.selector, model.uri, model.getLanguageId(), shouldSynchronizeModel(model), notebookType);
            if (isExclusive(entry.selector) && entry._score > 0) {
                // support for one exclusive selector that overwrites
                // any other selector
                for (let entry of this._entries) {
                    entry._score = 0;
                }
                entry._score = 1000;
                break;
            }
        }
        // needs sorting
        this._entries.sort(LanguageFeatureRegistry._compareByScoreAndTime);
    }
    static _compareByScoreAndTime(a, b) {
        if (a._score < b._score) {
            return 1;
        }
        else if (a._score > b._score) {
            return -1;
        }
        else if (a._time < b._time) {
            return 1;
        }
        else if (a._time > b._time) {
            return -1;
        }
        else {
            return 0;
        }
    }
}
