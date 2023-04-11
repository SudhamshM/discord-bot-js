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
                interaction.reply({embeds: embedToSend, components: components})
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

const components = [
    {
      "type": 1,
      "components": [
        {
          "style": 5,
          "label": `shapez`,
          "url": `https://store.epicgames.com/en-US/p/pageSlug`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 5,
          "label": `Dying Light`,
          "url": `https://store.epicgames.com/en-US/p/dying-light`,
          "disabled": false,
          "type": 2
        }
      ]
    }
  ]

const embedToSend = [
    {
      "type": "rich",
      "title": `This week's Free Games! 🎮`,
      "description": `Check out the free games on Epic Games for this week.`,
      "color": 0x00ffe5,
      "fields": [
        {
          "name": `Game:`,
          "value": `Dying Light: Enhanced Edition`
        },
        {
          "name": `Game:`,
          "value": `shapez`
        }
      ],
      "image": {
        "url": `https://prod.assets.earlygamecdn.com/images/epicfree.png?mtime=1669114612`,
        "height": 0,
        "width": 0
      },
      "thumbnail": {
        "url": `https://static-assets-prod.epicgames.com/epic-store/static/webpack/25c285e020572b4f76b770d6cca272ec.png`,
        "height": 0,
        "width": 0
      },
      "author": {
        "name": `Lover`
      },
      "footer": {
        "text": `Offers valid for this week only.`,
        "icon_url": `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Yellow_exclamation_mark.svg/1024px-Yellow_exclamation_mark.svg.png`
      }
    }
  ]