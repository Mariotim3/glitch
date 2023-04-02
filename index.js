

// temporary!!

let trained_inputs = ["hi"]; // These are the inputs
let trained_outputs = ["hello"]; // These are the outputs

const { Client, GatewayIntentBits } = require("discord.js");

const fs = require("fs");

require("dotenv/config");


// functions

function callback(){
    console.warn("CALLBACK!"); // Callback for fs
}

/*function respondToMessage(msg, interaction){

console.log("RECEIVED!!")

let message = (msg);

if (trained_inputs.includes(message)){

    let indexOfOutMessage = trained_inputs.indexOf(message);   

    return interaction.reply(trained_outputs[indexOfOutMessage]);

}

else
    {
       return interaction.reply("I don't know that yet! Why don't you train me? :D \n\n **///train**");
    }

} 
 */

// ABOVE IS NOT IN USE AS OF NOW!


// BASIC CLIENT & INTENTS

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

    if (msg.content.length > 1000){ // IF THE MESSAGE HAS MORE THAN 1000 CHARACTERS -> IGNORE IT!
        return;
    }

    if (!msg.author.bot) { 

        if (msg.channelId === "INSERT YOUR CHANNEL ID HERE"){ // CHANNEL AND GUILD_IDS TO ALLOW THE BOT TO CHAT IN. 

    let message = (msg.content.toLowerCase());

    if (trained_inputs.includes(message)){ // THIS IS SAYING IF THE TRAINED_INPUTS CONTAINS THE MESSAGE -> SET IT TO A VARIABLE OF indexOfOutMessage AND REPLY WITH THE CORRESPONDING INDEX OF THE TRAINED_OUTPUTS

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
       interaction.reply(`Ping is currently ${client.ws.ping}`); // PING COMMAND!
       return;
    }
    
    else if (interaction.commandName === "chat"){ // DIRECT MESSAGE CHAT FEATURE!
        let user_message = interaction.options.get("message").value;

        

        let message = (user_message);
        
        if (trained_inputs.includes(message)){
        
            let indexOfOutMessage = trained_inputs.indexOf(message);   
        
            console.log("RECEIVED!!" + trained_inputs[indexOfOutMessage] + " & " + trained_outputs[indexOfOutMessage]); // FOR DEBUGGING

             interaction.reply({content: trained_outputs[indexOfOutMessage], ephemeral: true});
             return;
        
        }
        
        else
            {
               return interaction.reply({content: "I don't know that yet! Why don't you train me? :D \n\n **/train**", ephemeral: true}); //IF THE BOT DOES NOT FIND THE MESSAGE IN THE ARRAY, IT WILL SEND THIS.
            }
    }

    else
        if (interaction.commandName == "train"){ // TRAINING SLASH COMMAND FUNCTION
            
            let train_input = interaction.options.get("input").value;
            let train_output = interaction.options.get("output").value;
            
            if (train_input.length > 1000 || train_output.length > 1000){
                interaction.reply({content: "You can't include more than 1000 characters in your input or output!", ephemeral: true});
                return;
            }

            trained_inputs.push(train_input.toLowerCase()); // CREATE A NEW INPUT
            trained_outputs.push(train_output); // CREATE A NEW OUTPUT DATA

            console.log(train_input.toLowerCase()) // MORE DEBUGGING 
            console.log(train_output)

            /*for (let word in trained_inputs){
                console.log("INPUT: " + trained_inputs[word] + " OUTPUT: " + trained_outputs[word]); // EVEN MORE DEBUGGING! DISABLED BY DEFAULT. 
            }*/


    
        }
       
        interaction.reply({content: "success!", ephemeral: true}); // REPLY WITH AN EPHEMERAL SUCCESS MESSAGE IF USED CORRECTLY!
        
        
        // BASIC INPUT AND OUTPUT DATA SAVING TO A .TXT FILE (YOU CAN CHANGE THIS TO JSON IF YOU'D LIKE!)
        
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

