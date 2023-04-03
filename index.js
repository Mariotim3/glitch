

// temporary!!

let t_inputs = require("./baseInOut").getInputs();
let t_outputs = require("./baseInOut").getOutputs();

let exported_channel_ids = require("./channel_ids").allowed_channel_ids();

let trained_inputs = [];
let trained_outputs = [];

let allowed_channel_ids = [];

function baseSetup(){
    trained_inputs = t_inputs;
    trained_outputs = t_outputs;
    allowed_channel_ids = exported_channel_ids;
   // console.log(allowed_channel_ids);
}

function removeFromArray(array, value){
    let index = array.indexOf(value);
   
    if (index > -1){
        array.splice(index, 1);
    }
    return console.log(array);

}

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
console.log(msg.channelId)
console.log(typeof(msg.channelId))
        if (allowed_channel_ids.includes(msg.channelId)){

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
    
        if (interaction.commandName === "join-channel"){
            allowed_channel_ids.push(interaction.channelId);
            interaction.reply("Glitch now has access to this channel!");
            
            for (let channel_id in allowed_channel_ids){
                fs.writeFile("./allowed_channel_ids.txt", "'" + allowed_channel_ids[channel_id] + "',", callback);
            }
            return;
        }

        if (interaction.commandName === "leave-channel"){
            removeFromArray(allowed_channel_ids, interaction.channelId);
            interaction.reply("Glitch no longer has access to this channel!");
            for (let channel_id in allowed_channel_ids){
                fs.writeFile("./allowed_channel_ids.txt", "'" + allowed_channel_ids[channel_id] + "',", callback);
            }
            return;
        }

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

            if (train_input.includes(",") || train_output.includes(",")){
                interaction.reply({content: "Sorry, as of now you cannot use commas in the input or output. This is due to issues with how our database handles them. Thank you for understanding.", ephemeral: true});
                return;
            }

            trained_inputs.push(train_input.toLowerCase());
            trained_outputs.push(train_output);

            console.log(train_input.toLowerCase())
            console.log(train_output)


            for (let word in trained_inputs){
                console.log("INPUT: " + trained_inputs[word] + " OUTPUT: " + trained_outputs[word]);
            }


    
        }
       
        interaction.reply({content: "success!", ephemeral: true});
        
        fs.writeFile('./append-data.txt', "", callback); // Clear the file

        for(let word in trained_inputs){
            fs.appendFileSync('./append-data.txt', "'" + trained_inputs[word] + '",', callback); // Append inputs
            console.log(trained_inputs[word]);
        }
    
        fs.appendFileSync("./append-data.txt", "\n", callback); // Line break
    
        for (let word in trained_outputs){
            fs.appendFileSync("./append-data.txt", "'" + trained_outputs[word] + '",', callback); // Append outputs
            console.log(trained_outputs[word])
    }

    for (let channel_id in allowed_channel_ids){
        fs.writeFile("./allowed_channel_ids.txt", "'" + allowed_channel_ids[channel_id] + '",', callback);
    }
    
   
    }   
}
    
    

    

);

baseSetup();

// console.log(trained_inputs.length + " & " + trained_outputs.length) DEBUGGING!

client.login(process.env.TOKEN);

