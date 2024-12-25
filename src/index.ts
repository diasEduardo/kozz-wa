import dotenv from 'dotenv';
dotenv.config();

import { io } from 'socket.io-client';
import whatsappBoundary from './Client';
import { registerSocketHandlers } from './Socket';
import { timedDelay } from './util/Time';

const socket = io(`${process.env.GATEWAY_URL}` || 'Http://127.0.0.1:4521', {
	path: process.env.SOCKET_PATH ?? '/socket.io/',
});

const wppClient = whatsappBoundary(socket);
wppClient.initialize();

registerSocketHandlers(wppClient, socket);

/*
timedDelay({
    hours:1,
    minutes:0,
    seconds:0,
    miliseconds:0
})
    */

