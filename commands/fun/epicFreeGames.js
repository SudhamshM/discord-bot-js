const { SlashCommandBuilder, ActionRowBuilder, 
  ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

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
              let [embedToSend, components] = processAPI(data);
              //console.log(embedToSend, row);
              interaction.reply({embeds: [embedToSend], components: components.components})
            })
            .catch(err => console.error(err));
        }


}

function processAPI(apiResponse) 
{
    let gamesList = [];
    let embedFinal = new EmbedBuilder();
    let componentsFinal = {
      "components": [
        {
          "type": 1,
          "components": [
          ]
        }
      ]
    }
    apiResponse.data.Catalog.searchStore.elements.forEach(element => {
        if (element.offerType === 'BASE_GAME')
        {
            if (element.promotions.promotionalOffers.length > 0)
            // checking start and end time and comparing to current time 
                if ((new Date().getTime() <= new Date(element.promotions.promotionalOffers[0].promotionalOffers[0].endDate).getTime()) 
                && (new Date(element.promotions.promotionalOffers[0].promotionalOffers[0].startDate).getTime() <= new Date().getTime()))
                    {
                        
                        gamesList.push(element);
                    }
                
        }
    });
    gamesList.forEach(element => {
      const gamePageUrl = element.catalogNs.mappings[0].pageSlug;
       embedFinal = EmbedBuilder.from(embedFinal).addFields(
          {
            "name": `Game:`,
            "value": `${element.title}`
          })
          .setDescription("Check out this week's free games from Epic Games.")
          .setColor(0x00ffe5)
          .setTitle(`This week's Free Games! :video_game:`)
          .setImage("https://prod.assets.earlygamecdn.com/images/epicfree.png?mtime=1669114612")
          .setThumbnail("https://static-assets-prod.epicgames.com/epic-store/static/webpack/25c285e020572b4f76b770d6cca272ec.png")
          .setFooter(
            {
              "text": `Offers valid for this week only.`,
              "icon_url": `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Yellow_exclamation_mark.svg/1024px-Yellow_exclamation_mark.svg.png`
            })

        const individualComponent = 
        {
          "style": 5,
          "label": `${element.title}`,
          "url": `https://store.epicgames.com/en-US/p/${gamePageUrl}`,
          "disabled": false,
          "type": 2
        }
        componentsFinal.components[0].components.push(individualComponent);
    });
    return [embedFinal, componentsFinal];
}