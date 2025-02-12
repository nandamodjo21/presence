import {Context} from "hono";
import OpenAI from "openai";
const openAI = new OpenAI({
    baseURL : 'https://api.deepseek.com',
    apiKey: process.env.OPENAI_API_KEY,

});
export async function bot_controller(c:Context) {
    const { prompt } = await c.req.json();
    console.log(prompt);
const completion = await openAI.chat.completions.create({
    messages: [{
        role:"system", content: prompt
    }],
    model:"deepseek-chat"
});
return c.json(completion);
}