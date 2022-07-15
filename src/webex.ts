import { IProcessArgs } from './type';

const https = require('https');

export const WEBEX_SPACES = {
    'webex api text': '38a7a410-d4c1-11ec-8ada-b1058fbde9fb'
};

export class Webex {

    token: string;
    spaces: string[];

    constructor(processArgs: IProcessArgs) {
        this.token = processArgs.tokenWebex;
        this.spaces = Object.values(WEBEX_SPACES);
    }

    message(text: string) {
        if(text && this.token) {
            this.spaces.forEach((roomId)=>{
                this.send({
                    roomId: roomId,
                    "text": text
                });
            });
        }
    }

    private send(data:any) {
        const _data = JSON.stringify(data);
        const _request = https.request({
            hostname: 'webexapis.com',
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Content-Length': _data.length
            }
        }, res => {
            //console.log(`state code: ${res.statusCode}`);
        })

        _request.on('error', error => {
            console.error('fail to send message');
            console.error(error);
        });
        _request.write(_data);
        _request.end();
    }
}