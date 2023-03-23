const { Util } = require('./Util');
const { Configuration, OpenAIApi } = require('openai');

class ChatGPT {

    constructor(){
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);
    }

    /**
     * chatGPTのAPIを叩いて、返答を返す
     * @param {Array} messages [{role:'assistant'|'user', content: "how are you?"}]
     * @returns {string} 返答
     */
    async getAnswer(messages){
        try{
            // openaiのAPIを叩いて返答を取得
            const res = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
            });
            let answer = res.data.choices[0].message?.content;
            Util.log(`[chatGPT] total token:${res.data.usage.total_tokens}. Answer:${answer.slice(0,10)+'...'}`);

            // 本文を返す
            return answer;

        }catch(e){
            Util.error(e);
            return '';
        }
    }

}

module.exports = { ChatGPT };