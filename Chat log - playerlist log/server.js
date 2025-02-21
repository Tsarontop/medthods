const bedrock = require('bedrock-protocol');
const { NIL, v3: uuidv3, v4: uuidv4, v5: uuidv5 } = require("uuid");
const { Authflow, Titles } = require("prismarine-auth");
const crypto = require("node:crypto");


const realmcode = "QyqH7KD_A7XiN6w"
const realmsAndAccounts = [
  { username: "Acc8", realmCode: realmcode }  
];

async function joinRealm(username,realmCode) {
  try {
    const bot = bedrock.createClient({
      profilesFolder: "./auth2",
      //username: email,
      skinData: {
        CurrentInputMode: 3,
        DefaultInputMode: 3,

        DeviceOS: 11, 
        DeviceId: uuidv3(uuidv4(), NIL),

        PlatformOnlineId: rs(19, "1234567890"),
        PrimaryUser: false,

        SelfSignedId: uuidv4(),
        ThirdPartyName: "sigmaboi sigmaboi",
        ThirdPartyNameOnly: true,

        TrustedSkin: true,
    },
    skipPing: true,
      realms: {
        realmInvite: realmCode
      }
    });
    

    bot.on('start_game', (packet) => {
      const corrds = packet.player_position;
      const runtimeEntityId = packet.runtimeEntityId
      console.log(`Bot ${username} has joined the realm ${realmcode}.`);
      

      bot.write('settings_command',{
        command_line: "/give @a diamond_ore 5",
        suppress_output: true
      });
      bot.write("text", {
        filtered_message: "",
        type: "chat",
        needs_translation: false,
        source_name: bot.profile.name,
        message: "sigma",
        xuid: "0",
        platform_chat_id: "0"
    });
    });

    bot.on('player_list', (packet) => {
        console.log('Player list received:', packet);

        if (!Array.isArray(packet.records.records)) {
          console.error('packet  is not an array:', packet.records.records);
          return;
        }
        const playerList = packet.records.records.map((player) => {

            return `${player.username}\nUUID: ${player.uuid}\nXUID: ${player.xbox_user_id ?? 'N/A'}`;
          }).join('\n\n');
    
       console.log(`${playerList}`)
        
    });
      
      bot.on('player_list_add', (packet) => {
        if (Array.isArray(packet.records)) {
          packet.records.forEach(record => {
            console.log(`Player joined: ${record.username}`);
          });
        } else {
          console.error(`Unexpected packet structure `, packet);
        }
      });

    bot.on('text', (packet) => {
      console.log(`[CHAT] ${packet.source_name}: ${packet.message}`)
      console.log(`[CHAT] Send by ${packet.xuid} / ${packet.source_name}  `)

      
    });

      bot.on('animate', (packet) => {
        console.log(`[emote] ${packet}`);
      });

    bot.on('close', () => {
      console.log(`Bot ${username} has crashed from ${realmCode}.`);
    });

    bot.on('error', (err) => {
      console.error(`An error occurred with Bot ${username}:`, err);
    });

    bot.on('kick', (message) => {
      console.error(`Bot ${username} was kicked from ${realmCode}:`, message);
    });

  } catch (error) {
    console.error('Error connecting the bot:', error);
  }
}

realmsAndAccounts.forEach(({ username, realmCode }) => {
  joinRealm(username, realmCode);
});

setInterval(() => {}, 1000);


function rs(length, charSet) {
    if (!charSet) charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_-";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return result;
}