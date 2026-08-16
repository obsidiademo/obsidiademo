/* Messaging */
window.REMS = window.REMS || {};
REMS.Messages = {
  currentChannel: 'ch-sales',

  view() {
    const d = REMS.Store.data;
    const channel = d.channels.find(c => c.id === this.currentChannel) || d.channels[0];
    this.currentChannel = channel.id;
    const msgs = d.messages.filter(m => m.channelId === channel.id);
    setTimeout(() => {
      const box = document.getElementById('chatBox');
      if (box) box.scrollTop = box.scrollHeight;
    }, 50);
    return `
    <div class="page-header"><div><h1>Mesajlar</h1><p>Ekip kanalları, DM ve @mention</p></div></div>
    <div class="chat-layout">
      <div class="chat-channels">
        ${d.channels.map(c => `<div class="chat-channel ${c.id===channel.id?'active':''}" onclick="REMS.Messages.open('${c.id}')">
          <strong>${c.name}</strong>
          <div class="text-muted" style="font-size:11px">${c.type === 'dm' ? 'Direkt mesaj' : 'Kanal'}</div>
        </div>`).join('')}
      </div>
      <div class="chat-main">
        <div class="card-header"><h3>${channel.name}</h3></div>
        <div class="chat-messages" id="chatBox">
          ${msgs.map(m => `<div class="chat-bubble ${m.user===d.currentUser.name?'mine':''}">
            <div class="meta">${m.user} · ${m.at}</div>
            ${m.text.replace(/@(\S+)/g, '<span class="mention">@$1</span>')}
          </div>`).join('') || '<p class="text-muted">Henüz mesaj yok</p>'}
        </div>
        <div class="chat-input">
          <input class="form-control" id="msgInput" placeholder="Mesaj yazın... @Ahmet @Muhasebe @BakırköyŞube" onkeydown="if(event.key==='Enter')REMS.Messages.send()">
          <button class="btn btn-primary" onclick="REMS.Messages.send()">Gönder</button>
        </div>
      </div>
    </div>`;
  },

  open(id) {
    this.currentChannel = id;
    REMS.Router.render();
  },

  send() {
    const text = document.getElementById('msgInput')?.value?.trim();
    if (!text) return;
    REMS.Store.data.messages.push({
      id: REMS.uid('msg'),
      channelId: this.currentChannel,
      user: REMS.Store.data.currentUser.name,
      text,
      at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      mentions: (text.match(/@\S+/g) || []).map(m => m.slice(1))
    });
    if (text.includes('@')) {
      REMS.notify('Mention', `${REMS.Store.data.currentUser.name} sizi mesajda etiketledi.`, 'mention');
    }
    REMS.Store.save();
    REMS.toast('Mesaj gönderildi');
    REMS.Router.render();
  }
};
