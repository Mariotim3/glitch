

// temporary!!

let trained_inputs = ["hi","owo","hiya","you’re","you’re gay","heheheh","bark","good boy","roll over","yes","no","rawr","hi","die","hello","hru","who's a good boi?","cute","are you a good boi?","i feel sad","goodnight","guys i think i’m gay","who do you love","damn","oh","i'm bored","yum","😩","gay"];
let trained_outputs = ["hello", "OwO","hii","no you are, punk","no you are, punk","what’s so funny?","WOOF WOOF","YAYAYAYA :DD","*rolls over*",":D","D:","grr >:)","go kys","kys","go kys","stfu","MEEEE!! MEEEE!!!! I AMMM!!!!! :D","aww I’m cute? :0","YES!! I'M A GOOD BOI!!! ME!!!","kill yourself","goodnight!! :))","*grabs flamethrower cutely*","ur mom","damn right son �","go die","go smoke weed","😉","GO TO HORNY JAIL","HOMO!!"];

const { Client, GatewayIntentBits } = require("discord.js");

const fs = require("fs");

require("dotenv/config");


// functions

function callback(){
    console.warn("CALLBACK!");
}

function respondToMessage(msg, interaction){

console.log("RECEIVED!!")

let message = (msg);

if (trained_inputs.includes(message)){

    let indexOfOutMessage = trained_inputs.indexOf(message);   

    return interaction.reply(trained_outputs[indexOfOutMessage]);

}

else
    {
       return interaction.reply("I don't know that yet! Why don't you train me? :D \n\n **/train**");
    }

}


const client = new Client({
    partials: ["CHANNEL", "MESSAGE"], intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping
    ], 
})


client.on("ready", () => {
    console.log(client.user.tag + " is now online!");
})


// RECEIVING MESSAGES

client.on("messageCreate", msg => {
    if (msg.content.startsWith(".")){
        return;
    } 

    if (msg.content.length > 1000){
        return;
    }

    if (!msg.author.bot) { 

        if (msg.channelId === "1091862243450310757" || msg.channelId === "1091981457074954290" || msg.guildId === "924890998457385021"){

    let message = (msg.content.toLowerCase());

    if (trained_inputs.includes(message)){

        let indexOfOutMessage = trained_inputs.indexOf(message);   

        msg.reply(trained_outputs[indexOfOutMessage]);

        function callback(){
            console.warn("CALLBACK!!");
        }
    }

    
    else
        {
            msg.reply("I don't know that yet! Why don't you train me? :D \n\n **/train**");
        }

}}});


// INTERACTIONS

client.on("interactionCreate", interaction => {
    if (interaction.isChatInputCommand()) {
    
    if (interaction.commandName === "ping"){
       // interaction.reply(`Ping is currently **${client.ws.ping}!**`);
       interaction.reply(`Ping is currently ${client.ws.ping}`);
       return;
    }
    
    else if (interaction.commandName === "chat"){
        let user_message = interaction.options.get("message").value;

        

        let message = (user_message);
        
        if (trained_inputs.includes(message)){
        
            let indexOfOutMessage = trained_inputs.indexOf(message);   
        
            console.log("RECEIVED!!" + trained_inputs[indexOfOutMessage] + " & " + trained_outputs[indexOfOutMessage]);

             interaction.reply({content: trained_outputs[indexOfOutMessage], ephemeral: true});
             return;
        
        }
        
        else
            {
               return interaction.reply({content: "I don't know that yet! Why don't you train me? :D \n\n **/train**", ephemeral: true});
            }
    }

    else
        if (interaction.commandName == "train"){
            
            let train_input = interaction.options.get("input").value;
            let train_output = interaction.options.get("output").value;
            
            if (train_input.length > 1000 || train_output.length > 1000){
                interaction.reply({content: "You can't include more than 1000 characters in your input or output!", ephemeral: true});
                return;
            }

            trained_inputs.push(train_input.toLowerCase());
            trained_outputs.push(train_output);

            console.log(train_input.toLowerCase())
            console.log(train_output)

            console.log("ZONES!!");

            for (let word in trained_inputs){
                console.log("INPUT: " + trained_inputs[word] + " OUTPUT: " + trained_outputs[word]);
            }


    
        }
       
        interaction.reply({content: "success!", ephemeral: true});
        
        fs.writeFile('./append-data.txt', "", callback); // Clear the file

        for(let word in trained_inputs){
            fs.appendFileSync('./append-data.txt', trained_inputs[word] + ',', callback); // Append inputs
            console.log(trained_inputs[word]);
        }
    
        fs.appendFileSync("./append-data.txt", "\n", callback); // Line break
    
        for (let word in trained_outputs){
            fs.appendFileSync("./append-data.txt", trained_outputs[word] + ",", callback); // Append outputs
            console.log(trained_outputs[word])
    }
    
   
    }   
}
    
    

    

);


client.login(process.env.TOKEN);

