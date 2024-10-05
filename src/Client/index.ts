import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { onMessageReceived } from 'src/Socket/Emitting';
import { Socket } from 'socket.io-client';
import { runningOnWindows } from 'src/util/OS';
import { onUserJoinedGroup } from 'src/Socket/Emitting/groupEvents';

type WaSocket = Socket;

const chromePath = runningOnWindows()
	? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
	: '/usr/bin/google-chrome-stable';

const createBoundary = (socket: WaSocket) => {
	const whatsappBoundary = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			executablePath: chromePath,

			args:[
				'--kiosks',
				'--disable-accelerated-2d-canvas',
				'--disable-backgrounding-occluded-windows',
				'--disable-renderer-backgrounding',
				'--disable-canvas-aa',
				'--disable-2d-canvas-clip-aa',
				'--disable-gl-drawing-for-tests',
				'--disable-dev-shm-usage', 
				'--disable-gpu',
				'--no-zygote', 
				'--use-gl=desktop', 
				'--hide-scrollbars',
				'--mute-audio',
				'--no-first-run',
				'--disable-infobars',
				'--disable-breakpad', 
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--enable-logging',
				'--v=1'
			],
			headless: true,
		},
	});

	whatsappBoundary.on('qr', qr => {
		qrcode.generate(qr, { small: true });
	});

	whatsappBoundary.on('ready', () => {
		console.log('[SERVIDOR]: Cliente pronto');
	});

	whatsappBoundary.on('change_state', state => {
		console.log(state);
		process.exit(0);
	});

	whatsappBoundary.on('auth_failure', message => console.log(message));

	whatsappBoundary.on('loading_screen', (percent, message) =>
		console.log({
			percent,
			message,
		})
	);

	whatsappBoundary.on('group_join', onUserJoinedGroup(whatsappBoundary, socket));

	whatsappBoundary.on('group_leave', onUserJoinedGroup(whatsappBoundary, socket));

	// [TODO]: Make "host_metioned" a forwardable event.
	whatsappBoundary.on('message_create', async message => {});

	whatsappBoundary.on('message_create', async message => {
		onMessageReceived(socket, whatsappBoundary)(message);
	});

	return whatsappBoundary;
};

export default createBoundary;
