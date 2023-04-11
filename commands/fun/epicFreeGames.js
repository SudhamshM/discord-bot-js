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
                let replySendable = "**This week's Free Games!** :video_game: \n\n ";
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
            if (element.promotions.promotionalOffers.length > 0)
            // checking start and end time and comparing to current time 
                if ((new Date().getTime() <= new Date(element.promotions.promotionalOffers[0].promotionalOffers[0].endDate).getTime()) 
                && (new Date(element.promotions.promotionalOffers[0].promotionalOffers[0].startDate).getTime() <= new Date().getTime()))
                    gamesList.push(element);
        }
    });
    return gamesList;
}