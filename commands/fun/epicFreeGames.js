const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('epic')
            .setDescription('See currently free games on Epic Games'),
        async execute(interaction)
        {
            fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions')
            .then((response) => response.json())
            .then((data) => 
            {
                let gamesList = processAPI(data);
                let replySendable = "";
                gamesList.forEach(game => replySendable += game.title + "\n");
                interaction.reply(replySendable)
            })
            .catch(err => console.error(err));
        }


}

function processAPI(apiResponse) 
{
    let gamesList = [];
    apiResponse.data.Catalog.searchStore.elements.forEach(element => {
        if (element.offerType === 'BASE_GAME')
        {
            gamesList.push(element);
        }
    });
    return gamesList;
}