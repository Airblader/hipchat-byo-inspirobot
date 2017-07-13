const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());

const fromText = message => {
    return {
        message,
        notify: false,
        message_format: 'text',
    };
};

const rejectResponse = body => {
    const mention = body.item.message.from.mention_name;
    const responses = [
        `@${mention} You wish!`,
        `@${mention} Do I look like your meme monkey, ${body.item.message.from.name}?`,
        `@${mention} I don't feel like it.`,
        `@${mention} Yes?`,
        `@${mention} YOU SHALL NOT QUOTE!`,
        `@${mention} Nice try!`,
        `@${mention} Over my dead body.`,
        `@${mention} The bot you have called is currently not available.`,
        `@${mention} I'll do it later. I promise.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
};

const inspiroMe = async () => {
    return await fetch('http://inspirobot.me/api?generate=true')
        .then(response => response.text());
};

app.post('/inspirobot', async (req, res) => {
    try {
        if (Math.random() <= 0.2) {
            return res.json(fromText(rejectResponse(req.body)));
        }

        const url = await inspiroMe();
        return res.json(fromText(url));
    } catch (err) {
        console.error(err);
    }
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
