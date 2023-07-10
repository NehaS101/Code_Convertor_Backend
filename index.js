const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send("welcome to code convertor") })

async function runprompt(mssg) {
    try {
        const config = new Configuration({
            apiKey: process.env.Ai_Key
        })
        const openai = new OpenAIApi(config);
        let response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: mssg,
            max_tokens: 500,
            temperature: 1,
        });
        let result = response.data.choices[0].text;
        return result;
    } catch (error) {
        console.log({ error: error.message })
    }
}
//converting code
app.post('/convert', async (req, res) => {
    let { code, language } = req.body;
    console.log(req.body)
    try {
        let response = await runprompt(`convert the ${code} into ${language}`);
        res.json({response});
    } catch (error) {
        res.send({ error: error.message });
    }
})

//debugging the code
app.post('/debug',async(req,res)=>{
    let {code}=req.body;
    try {
       let response = await runprompt(`debug the ${code} check what is the error in the code give the way to rewrite or correct it`);
       res.json({response}); 
    } catch (error) {
        res.send({error:error.message})
    }
})

//checking quality
app.post('/quality',async(req,res)=>{
    let {code} = req.body;
    try {
        let response = await runprompt(`check the quality of ${code} and give explaination briefly and provide score according to quality and methods to improve`)
        res.json({response})
    } catch (error) {
        res.send({error:error.message})
    }
})
app.listen(process.env.port, () => {
    console.log("listening on port " + process.env.port);
})