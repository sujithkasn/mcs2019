import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Url {
    public static addParam(url: string, param: string, value: any): string {
        const parts: string[] = url.split('?');
        const address: string = parts[0];
        let search: string = '?' + (parts.length > 1 ? parts[1] : '');

        const regex: RegExp = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/g;
        const str: Array<any> = [];

        let match: RegExpExecArray | null = regex.exec(search);
        while (match) {
            if (param !== match[1]) {
                str.push(match[1] + (match[2] ? '=' + match[2] : ''));
            }
            match = regex.exec(search);
        }
        str.push(param + (value ? '=' + value : ''));
        search = str.join('&');
        return address + '?' + search;
    }
}
