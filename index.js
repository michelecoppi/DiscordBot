require('dotenv/config');
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const cities = require('cities.json');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});

client.on('ready', () => {
    console.log('Ready!');
});



client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;
    if (message.content === '/randomNumber') {
        const random = Math.floor(Math.random() * 100);
        message.reply(`Your random number is: ${random}`);
        return;

    }
    if (message.content === '/randomPerson') {
        let name = "";
        let lastName = "";
        let avatar = "";
        const namePromise = new Promise((resolve, reject) => {
          fs.readFile('names.json', (err, data) => {
            if (err) reject(err);
            const nomi = JSON.parse(data);
            const randomIndex = Math.floor(Math.random() * nomi.length);
            resolve(nomi[randomIndex]);
          });
        });
        const lastNamePromise = new Promise((resolve, reject) => {
          fs.readFile('lastNames.json', (err, data) => {
            if (err) reject(err);
            const cognomi = JSON.parse(data);
            const randomIndex = Math.floor(Math.random() * cognomi.length);
            resolve(cognomi[randomIndex]);
          });
        });
        const jobsPromise = new Promise((resolve, reject) => {
          fs.readFile('jobs.json', (err, data) => {
            if (err) reject(err);
            const jobs = JSON.parse(data);
            const randomIndex = Math.floor(Math.random() * jobs.length);
            resolve(jobs[randomIndex]);
          });
        });
      
        Promise.all([namePromise, lastNamePromise, jobsPromise])
          .then(([nameValue, lastNameValue, jobsValue]) => {
            name = nameValue;
            lastName = lastNameValue;
            job = jobsValue;
            rand = Math.floor(Math.random() * cities.length);
            avatar = `https://robohash.org/${name}${lastName}.png?set=set3`;
      
                  const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Random Person')
                    .setDescription(`Name: ${name}\nSurname: ${lastName}\nCity: ${cities[rand].name}, ${cities[rand].country}\nJob: ${job}`)
                    .setImage(avatar);
      
                  message.reply({ embeds: [embed] });
          
           
          })
          .catch((err) => {
            console.error(err);
            message.reply(`An error occurred, please try again later.`);
          });
      }

    if (message.content === '/ping') {
        message.reply('Pong!');
        return;
    }
    if (message.content === '/info') {
        message.reply('This bot was made by: Gabbiano#2389');
        return;
    }




});


client.login(process.env.TOKEN);