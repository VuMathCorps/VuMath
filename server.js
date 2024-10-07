import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import OpenAI from 'openai';

const app = express();
const PORT = 3000;

app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/process-input', async (req, res) => {
    const form = new IncomingForm({
        keepExtensions: true,
        multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
        /*if (err) {
            console.error('Form parsing error:', err);
            return res.status(500).json({ error: 'Form parsing error', details: err.message });
        }*/

        try {
            const prompt = typeof fields.prompt === 'string' ? fields.prompt : 
                          Array.isArray(fields.prompt) ? fields.prompt[0] : '';
            
            console.log('prompt:', prompt);

            const imageFields = Object.entries(fields).filter(([key, value]) => 
                key.startsWith('image') && typeof value === 'string' && value.startsWith('data:image/')
            );

            const messages = [{
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    ...imageFields.map(([_, imageData]) => ({
                        type: "image_url",
                        image_url: {
                            url: imageData
                        }
                    }))
                ]
            }];

            console.log('Sending request to OpenAI with message structure:', 
                JSON.stringify(messages, (key, value) => 
                    key === 'image_url' ? '[IMAGE DATA]' : value
                )
            );

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: 1000,
            });

            res.json({ response: response.choices[0].message.content });
        } catch (error) {
			console.log('Failed to generate notes: ', error);
        }
    });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});