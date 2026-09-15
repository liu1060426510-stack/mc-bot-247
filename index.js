const bedrock = require('bedrock-protocol');

const host = 'PLAYON-5DP9.aternos.me';
const port = 19139;

function createBot(botName, delay) {
    setTimeout(() => {
        console.log(`[${botName}] 正在嘗試連線至 ${host}:${port}...`);
        
        const client = bedrock.createClient({
            host: host,
            port: port,
            username: botName,
            offline: true
        });

        client.on('spawn', () => {
            console.log(`[${botName}] 成功進入伺服器！開始執行 24/7 保活防踢...`);
            
            // 每 30 秒模擬一次活躍
            setInterval(() => {
                if (client.status === 'playing') {
                    client.write('player_auth_input', {
                        pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
                        move_vector: { x: 0.1, z: 0.1 }, head_yaw: 0,
                        input_data: { jump: true }, input_mode: 'mouse',
                        play_mode: 'normal', tick: 0n
                    });
                    console.log(`[${botName}] 已發送防踢活躍封包`);
                }
            }, 30000);
        });

        client.on('close', (reason) => {
            console.log(`[${botName}] 斷線了 (${reason})。20 秒後重新連線...`);
            createBot(botName, 20000); // 增加重連延遲，防止被 Aternos 鎖 IP
        });

        client.on('error', (err) => {
            console.error(`[${botName}] 發生錯誤:`, err.message);
        });

    }, delay);
}

// 修正：直接把名字和延遲時間寫死，不要再讀取陣列，第 2 個故意延遲 25 秒進服
createBot('MC_Keeper_1', 0);
createBot('MC_Keeper_2', 25000); // 延長間隔時間，防止被 Aternos 偵測為連續惡意連線

// 讓程式在 GitHub Actions 中持續運作
setInterval(() => {
    console.log('[系統狀態] 雙假人程式持續運作中...');
}, 60000);
