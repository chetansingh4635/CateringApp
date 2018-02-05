import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {
    private _variable : string

    constructor(variable : string) {
        this._variable = variable;
     }

    set value(payload : any) {
        if(typeof payload == 'string') {
            localStorage.setItem(this._variable, payload);
        } else if(typeof payload == 'object') {
            localStorage.setItem(this._variable, JSON.stringify(payload));
        } else {
            throw new Error('LocalStorage Error: \'value\' can only be a string or an object.');
        }
    }

    get value() : any {
        let result, payload = localStorage.getItem(this._variable);

        try {
            result = <object> JSON.parse(payload)
        } catch(e) {
            result = <string> payload;
        }

        return result
    }

    static clear(): void {
        localStorage.clear();
    }

    static remove(key : string): void {
        localStorage.removeItem(key);
    }
}