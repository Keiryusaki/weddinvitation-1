import express from 'express';
import cors from 'cors';
import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Discord Client Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Middleware
app.use(cors());
app.use(express.json());

// Store channel reference
let wishesChannel = null;

// Discord Bot Ready
client.once('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  wishesChannel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  if (wishesChannel) {
    console.log(`📢 Connected to channel: #${wishesChannel.name}`);
  } else {
    console.error('❌ Channel not found! Check DISCORD_CHANNEL_ID');
  }
});

// ============================================
// DISCORD BOT COMMANDS
// ============================================

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Only respond in the wishes channel
  if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;

  // !purge command - Clear all messages in channel
  if (message.content.toLowerCase() === '!purge') {
    try {
      // Check if user has admin/manage messages permission
      if (!message.member.permissions.has('ManageMessages')) {
        return message.reply('❌ Kamu tidak punya izin untuk menghapus pesan!');
      }

      // Create confirmation buttons
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('purge_confirm')
            .setLabel('Ya, Hapus Semua')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑️'),
          new ButtonBuilder()
            .setCustomId('purge_cancel')
            .setLabel('Batal')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❌'),
        );

      const confirmMsg = await message.reply({
        content: '⚠️ **Yakin mau hapus SEMUA pesan di channel ini?**\nAksi ini tidak bisa dibatalkan!',
        components: [row],
      });

      // Wait for button interaction
      const filter = (i) => i.user.id === message.author.id && (i.customId === 'purge_confirm' || i.customId === 'purge_cancel');

      try {
        const interaction = await confirmMsg.awaitMessageComponent({ filter, time: 30000 });

        if (interaction.customId === 'purge_cancel') {
          await interaction.update({ content: '❌ Purge dibatalkan.', components: [] });
          return;
        }

        // User confirmed - start purging
        await interaction.update({ content: '🗑️ Menghapus pesan...', components: [] });

        // Delete messages in batches
        let deleted = 0;
        let hasMore = true;

        while (hasMore) {
          const msgs = await message.channel.messages.fetch({ limit: 100 });
          if (msgs.size === 0) {
            hasMore = false;
            break;
          }

          // Filter messages younger than 14 days (Discord limitation)
          const deletable = msgs.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

          if (deletable.size === 0) {
            hasMore = false;
            break;
          }

          await message.channel.bulkDelete(deletable, true);
          deleted += deletable.size;

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await message.channel.send(`✅ Berhasil menghapus ${deleted} pesan! Channel siap untuk undangan.`);
      } catch (err) {
        // Timeout - no button clicked
        await confirmMsg.edit({ content: '❌ Purge dibatalkan (timeout).', components: [] });
      }
    } catch (error) {
      console.error('Purge error:', error);
      message.reply('❌ Gagal menghapus pesan. Coba lagi nanti.');
    }
  }

  // !help command
  if (message.content.toLowerCase() === '!help') {
    const helpEmbed = new EmbedBuilder()
      .setColor(0xC5A059)
      .setTitle('📖 Bot Commands')
      .setDescription('Daftar perintah yang tersedia:')
      .addFields(
        { name: '!purge', value: 'Hapus semua pesan di channel ini (perlu konfirmasi)', inline: false },
        { name: '!help', value: 'Tampilkan daftar perintah ini', inline: false },
      )
      .setFooter({ text: 'Wedding Invitation Bot - Etin & Aji' });

    message.reply({ embeds: [helpEmbed] });
  }
});

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    bot: client.user ? client.user.tag : 'not connected',
    channel: wishesChannel ? wishesChannel.name : 'not connected'
  });
});

// GET /wishes - Fetch all wishes from Discord channel
app.get('/wishes', async (req, res) => {
  try {
    if (!wishesChannel) {
      return res.status(503).json({ error: 'Discord channel not connected' });
    }

    // Fetch messages from channel (limit 100)
    const messages = await wishesChannel.messages.fetch({ limit: 100 });

    // Filter only embed messages (wishes from bot)
    const wishes = [];

    messages.forEach((msg) => {
      // Check if it's a wish embed from our bot
      if (msg.embeds.length > 0 && msg.author.id === client.user.id) {
        const embed = msg.embeds[0];

        // Extract data from embed
        const nameField = embed.fields?.find(f => f.name === '👤 Nama');
        const attendanceField = embed.fields?.find(f => f.name === '📋 Kehadiran');

        wishes.push({
          id: msg.id,
          name: nameField?.value || 'Anonim',
          message: embed.description || '',
          attendance: attendanceField?.value?.toLowerCase().includes('hadir')
            ? 'hadir'
            : attendanceField?.value?.toLowerCase().includes('tidak')
              ? 'tidak'
              : 'ragu',
          createdAt: msg.createdTimestamp,
          replies: [],
        });
      }
    });

    // Fetch replies for each wish (direct replies, not threads)
    for (const wish of wishes) {
      messages.forEach((msg) => {
        // Check if this message is a reply to the wish
        if (msg.reference && msg.reference.messageId === wish.id && !msg.author.bot) {
          wish.replies.push({
            id: msg.id,
            author: msg.author.displayName || msg.author.username,
            message: msg.content,
            createdAt: msg.createdTimestamp,
          });
        }
      });

      // Sort replies by time (oldest first)
      wish.replies.sort((a, b) => a.createdAt - b.createdAt);
    }

    // Sort wishes by time (newest first)
    wishes.sort((a, b) => b.createdAt - a.createdAt);

    res.json({ wishes });
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
});

// POST /wishes - Send a new wish to Discord
app.post('/wishes', async (req, res) => {
  try {
    const { name, message, attendance } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    if (!wishesChannel) {
      return res.status(503).json({ error: 'Discord channel not connected' });
    }

    // Create beautiful embed
    const attendanceEmoji = attendance === 'hadir' ? '✅' : attendance === 'tidak' ? '❌' : '❓';
    const attendanceText = attendance === 'hadir' ? 'Hadir' : attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu-ragu';
    const attendanceColor = attendance === 'hadir' ? 0x22c55e : attendance === 'tidak' ? 0xef4444 : 0xeab308;

    const embed = new EmbedBuilder()
      .setColor(attendanceColor)
      .setTitle('💌 Ucapan & Doa Baru')
      .setDescription(message)
      .addFields(
        { name: '👤 Nama', value: name, inline: true },
        { name: '📋 Kehadiran', value: `${attendanceEmoji} ${attendanceText}`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Wedding Invitation - Etin & Aji' });

    // Send to Discord
    const sentMessage = await wishesChannel.send({ embeds: [embed] });

    res.json({
      success: true,
      wish: {
        id: sentMessage.id,
        name,
        message,
        attendance,
        createdAt: sentMessage.createdTimestamp,
        replies: [],
      }
    });
  } catch (error) {
    console.error('Error sending wish:', error);
    res.status(500).json({ error: 'Failed to send wish' });
  }
});

// ============================================
// START SERVER & BOT
// ============================================

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to login Discord bot:', error);
    process.exit(1);
  });
