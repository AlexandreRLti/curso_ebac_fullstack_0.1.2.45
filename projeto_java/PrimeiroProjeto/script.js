const defaultParams = [
    ['Pressão de injeção', '120–160 bar'],
    ['Velocidade de injeção', '40–70 mm/s'],
    ['Pressão de recalque', '60–100 bar'],
    ['Tempo de recalque', '3–6 s'],
    ['Temperatura do cilindro (Z1)', '180–200 °C'],
    ['Temperatura do cilindro (Z2)', '185–205 °C'],
    ['Temperatura do cilindro (Z3)', '190–210 °C'],
    ['Temperatura do molde', '30–60 °C'],
    ['Tempo de ciclo', '25–40 s'],
    ['Capacidade de fechamento', '1600 kN']
];

const machines = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Injetora ${String(i + 1).padStart(2, '0')}`,
    code: `INJ-${String(i + 1).padStart(2, '0')}`,
    brand: i === 0 ? 'Haitian' : '—',
    model: i === 0 ? 'MA 1600' : 'Não informado',
    capacity: i === 0 ? '1600 ton' : '—',
    serial: i === 0 ? 'HT2020001' : '—',
    updated: '08/10/2026',
    params: defaultParams.map(p => [...p]),
    molds: [
        { name: 'Molde 001', part: 'Peça A - 10234' },
        { name: 'Molde 002', part: 'Peça B - 10235' }
    ],
    notes: 'Utilizar somente materiais aprovados pelo setor de qualidade.',
    files: []
}));

let selected = 0;
let tab = 'config';
let userRole = null; // 'tecnico' ou 'facilitador'

const $ = id => document.getElementById(id);

// --- LÓGICA DE LOGIN ---
const toggleBtn = $('toggle');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const p = $('password');
        p.type = p.type === 'password' ? 'text' : 'password';
        toggleBtn.textContent = p.type === 'password' ? 'Mostrar senha' : 'Ocultar senha';
    });
}

const loginForm = $('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = $('email').value.trim().toLowerCase();
        const password = $('password').value;
        let role = null;

        if (username === 'tecnico' && password === '4545') {
            role = 'tecnico';
        } else if (username === 'facilitador' && password === '050623') {
            role = 'facilitador';
        }

        const notice = $('notice');
        if (!role) {
            notice.className = 'notice showmsg error';
            notice.textContent = 'Usuário ou senha incorretos. Verifique as credenciais de demonstração.';
            return;
        }

        userRole = role;
        $('loginScreen').style.display = 'none';$('portalScreen').style.display = 'block';

        if (role === 'tecnico') {
            $('roleBadge').textContent = '● Perfil: Técnico (Edição Ativa)';
            $('roleBadge.style').background = '#e5f7ed';
        } else {
            $('roleBadge').textContent = '● Perfil: Facilitador (Somente Consulta)';
        }

        render();
    });
}

const logoutBtn = $('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        userRole = null;
        $('portalScreen').style.display = 'none';
        $('loginScreen').style.display = 'flex';$('email').value = '';
        $('password').value = '';$('notice').className = 'notice';
    });
}

// --- RENDERIZAÇÃO DO PORTAL ---
function renderList() {
    const q = $('search').value.toLowerCase();
    const listEl = $('machineList');
    if (!listEl) return;

    listEl.innerHTML = machines
        .filter(m => (m.name + ' ' + m.code).toLowerCase().includes(q))
        .map(m => `
            <div class="machine ${m.id - 1 === selected ? 'selected' : ''}" data-id="${m.id - 1}">
                <b>${m.name}</b>
                <small>${m.code}</small>
            </div>
        `).join('') || '<div class="sub" style="padding:10px;">Nenhuma máquina encontrada.</div>';

    document.querySelectorAll('.machine').forEach(el => {
        el.onclick = () => {
            selected = +el.dataset.id;
            tab = 'config';
            render();
        };
    });
}

function render() {
    if (!userRole) return;
    let m = machines[selected];

    $('statSelected').textContent = String(m.id).padStart(2, '0');$('detailTitle').textContent = 'Ficha Técnica — ' + m.name;
    $('detailSub').textContent = `Código: ${m.code} · Última atualização: ${m.updated}`;

    // Restringe botões de alteração baseando-se no perfil (Técnico vs Facilitador)
    const canEdit = (userRole === 'tecnico');
    $('editBtn').classList.toggle('hide', !canEdit);$('addBtn').classList.toggle('hide', !canEdit);

    document.querySelectorAll('.tab').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
    });

    renderList();

    let c = '';
    if (tab === 'config') {
        c = `
            <div class="machine-data">
                ${[['Marca', m.brand], ['Modelo', m.model], ['Capacidade de injeção', m.capacity], ['Nº de série', m.serial]]
                    .map(([a, b]) => `<div class="field-box"><label>${a}</label><strong>${esc(b)}</strong></div>`).join('')}
            </div>
            <div class="section-title">Parâmetros de configuração</div>
            <div class="tablewrap">
                <table>
                    <thead><tr><th>Parâmetro</th><th>Valor configurado</th></tr></thead>
                    <tbody>${m.params.map(([a, b]) => `<tr><td>${esc(a)}</td><td><b>${esc(b)}</b></td></tr>`).join('')}</tbody>
                </table>
            </div>`;
    } else if (tab === 'molds') {
        c = `
            <div class="section-title" style="margin-top:0">Moldes associados a ${m.name}</div>
            <div class="tablewrap">
                <table>
                    <thead><tr><th>Molde</th><th>Peça / código</th></tr></thead>
                    <tbody>${m.molds.map(x => `<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.part)}</td></tr>`).join('')}</tbody>
                </table>
            </div>
            ${canEdit ? '<p><button class="secondary" id="addMold">＋ Adicionar molde</button></p>' : ''}`;
    } else {
        c = `
            <div class="section-title" style="margin-top:0">Observações técnicas</div>
            <div class="note">ⓘ &nbsp;${esc(m.notes || 'Nenhuma observação cadastrada.')}</div>
            <div class="section-title">Arquivos anexados</div>
            <div class="panel" style="background:#f8fafc">${m.files.length ? m.files.map(f => `<div>📎 ${esc(f)}</div>`).join('') : 'Nenhum arquivo anexado.'}</div>
            ${canEdit ? '<p><button class="secondary" id="editNotes">✎ Editar observações / anexar arquivo</button></p>' : ''}`;
    }

    $('tabContent').innerHTML = c;

    if ($('addMold'))$('addMold').onclick = () => openModal('mold');
    if ($('editNotes'))$('editNotes').onclick = () => openModal('notes');
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.querySelectorAll('.tab').forEach(b => {
    b.onclick = () => { tab = b.dataset.tab; render(); };
});

const searchInput = $('search');
if (searchInput) searchInput.oninput = renderList;

const editBtn = $('editBtn');
if (editBtn) editBtn.onclick = () => openModal('edit');

const addBtn = $('addBtn');
if (addBtn) addBtn.onclick = () => openModal('new');

// --- MODAIS DE CADASTRO E EDIÇÃO ---
function openModal(kind) {
    let m = machines[selected];
    let title = kind === 'new' ? 'Criar ficha técnica' : kind === 'edit' ? 'Editar ficha — ' + m.name : kind === 'mold' ? 'Adicionar molde' : 'Observações e arquivos';
    let body = '';

    if (kind === 'edit' || kind === 'new') {
        body = `
            <div class="formgrid">
                <label>Nome da máquina<input name="name" value="${kind === 'new' ? '' : esc(m.name)}" required></label>
                <label>Código<input name="code" value="${kind === 'new' ? '' : esc(m.code)}" required></label>
                <label>Marca<input name="brand" value="${kind === 'new' ? '' : esc(m.brand)}"></label>
                <label>Modelo<input name="model" value="${kind === 'new' ? '' : esc(m.model)}"></label>
                <label>Capacidade de injeção<input name="capacity" value="${kind === 'new' ? '' : esc(m.capacity)}"></label>
                <label>Nº de série<input name="serial" value="${kind === 'new' ? '' : esc(m.serial)}"></label>
                <label class="wide">Parâmetros (um por linha: Nome = Valor)<textarea name="params">${kind === 'new' ? 'Pressão de injeção = \nVelocidade de injeção = \nTemperatura do molde = ' : m.params.map(p => p.join(' = ')).join('\n')}</textarea></label>
            </div>`;
    } else if (kind === 'mold') {
        body = `<div class="formgrid"><label>Nome do molde<input name="moldname" required placeholder="Ex.: Molde 004"></label><label>Peça / código<input name="part" placeholder="Ex.: Peça D - 10237"></label></div>`;
    } else {
        body = `
            <div class="formgrid">
                <label class="wide">Observações<textarea name="notes">${esc(m.notes)}</textarea></label>
                <label class="wide">Anexar arquivo<input type="file" name="file" multiple></label>
            </div>`;
    }

    $('modalRoot').innerHTML = `
        <div class="modal-back">
            <form class="modal" id="modalForm">
                <h2>${title}</h2>
                ${body}
                <div class="modal-actions">
                    <button type="button" id="cancel" class="secondary">Cancelar</button>
                    <button class="primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>`;

    $('cancel').onclick = () => { $('modalRoot').innerHTML = ''; };$('modalForm').onsubmit = e => {
        e.preventDefault();
        let fd = new FormData(e.target);

        if (kind === 'edit') {
            m.name = fd.get('name');
            m.code = fd.get('code');
            m.brand = fd.get('brand') || '—';
            m.model = fd.get('model') || '—';
            m.capacity = fd.get('capacity') || '—';
            m.serial = fd.get('serial') || '—';
            m.params = String(fd.get('params')).split('\n').map(line => line.split('=').map(x => x.trim())).filter(x => x[0]);
            m.updated = new Date().toLocaleDateString('pt-BR');
        }
        if (kind === 'new') {
            let n = {
                id: machines.length + 1,
                name: fd.get('name') || 'Nova máquina',
                code: fd.get('code') || `INJ-${machines.length + 1}`,
                brand: fd.get('brand') || '—',
                model: fd.get('model') || '—',
                capacity: fd.get('capacity') || '—',
                serial: fd.get('serial') || '—',
                updated: new Date().toLocaleDateString('pt-BR'),
                params: String(fd.get('params')).split('\n').map(line => line.split('=').map(x => x.trim())).filter(x => x[0]),
                molds: [],
                notes: '',
                files: []
            };
            machines.push(n);
            selected = machines.length - 1;
        }
        if (kind === 'mold') {
            m.molds.push({ name: fd.get('moldname'), part: fd.get('part') || '—' });
        }
        if (kind === 'notes') {
            m.notes = fd.get('notes');
            for (const f of fd.getAll('file')) {
                if (f.name) m.files.push(f.name);
            }
        }

        $('modalRoot').innerHTML = '';
        render();
    };
}

document.querySelectorAll('[data-nav]').forEach(b => {
    b.onclick = () => {
        document.querySelectorAll('[data-nav]').forEach(x => x.classList.toggle('active', x === b));
        if (b.dataset.nav === 'molds') tab = 'molds';
        else if (b.dataset.nav === 'history') tab = 'notes';
        else tab = 'config';
        render();
    };
});