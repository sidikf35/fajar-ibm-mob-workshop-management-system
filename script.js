/* ===================================================
   AutoServ Pro — script.js
   Vanilla JS · LocalStorage · Modular
=================================================== */

// ===================================================
// 1. DATA STORE
// ===================================================
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  // Keys
  CUSTOMERS:    'asp_customers',
  VEHICLES:     'asp_vehicles',
  MECHANICS:    'asp_mechanics',
  SERVICES:     'asp_services',
  TRANSACTIONS: 'asp_transactions',
  PAYMENTS:     'asp_payments',
};

// ===================================================
// 2. SEED DATA (runs once if no data exists)
// ===================================================
function seedData() {
  if (DB.get(DB.CUSTOMERS).length) return; // already seeded

  const customers = [
    { id:'C001', name:'Budi Santoso',   phone:'081234567890', email:'budi@email.com',   address:'Jl. Merdeka No.12, Jakarta' },
    { id:'C002', name:'Siti Rahayu',    phone:'082345678901', email:'siti@email.com',   address:'Jl. Sudirman No.45, Bandung' },
    { id:'C003', name:'Agus Wijaya',    phone:'083456789012', email:'agus@email.com',   address:'Jl. Diponegoro No.7, Surabaya' },
    { id:'C004', name:'Dewi Kusuma',    phone:'084567890123', email:'dewi@email.com',   address:'Jl. Gatot Subroto No.88, Medan' },
  ];
  DB.set(DB.CUSTOMERS, customers);

  const vehicles = [
    { id:'V001', plate:'B 1234 ABC', ownerId:'C001', ownerName:'Budi Santoso',  brand:'Toyota',  model:'Avanza',  year:2020, type:'Mobil', color:'Putih' },
    { id:'V002', plate:'D 5678 XYZ', ownerId:'C002', ownerName:'Siti Rahayu',   brand:'Honda',   model:'Beat',    year:2021, type:'Motor', color:'Hitam' },
    { id:'V003', plate:'L 9012 DEF', ownerId:'C003', ownerName:'Agus Wijaya',   brand:'Suzuki',  model:'Ertiga',  year:2019, type:'Mobil', color:'Silver' },
    { id:'V004', plate:'BK 3456 GHI', ownerId:'C004', ownerName:'Dewi Kusuma', brand:'Yamaha',  model:'NMAX',    year:2022, type:'Motor', color:'Biru' },
  ];
  DB.set(DB.VEHICLES, vehicles);

  const mechanics = [
    { id:'M001', name:'Andi Prasetyo',  phone:'085678901234', spec:'Mesin',       status:'Tersedia' },
    { id:'M002', name:'Rudi Hartono',   phone:'086789012345', spec:'Kelistrikan', status:'Tersedia' },
    { id:'M003', name:'Joko Susanto',   phone:'087890123456', spec:'Sistem Rem',  status:'Sibuk' },
    { id:'M004', name:'Hendra Gunawan', phone:'088901234567', spec:'Umum',        status:'Tersedia' },
  ];
  DB.set(DB.MECHANICS, mechanics);

  const services = [
    { id:'S001', name:'Servis Rutin',      desc:'Pemeriksaan menyeluruh dan perawatan berkala kendaraan.',       cost:150000, duration:'2-3 jam' },
    { id:'S002', name:'Ganti Oli Mesin',   desc:'Penggantian oli mesin dengan oli berkualitas.',                  cost:85000,  duration:'30 menit' },
    { id:'S003', name:'Perbaikan Rem',     desc:'Pemeriksaan dan perbaikan sistem pengereman kendaraan.',        cost:200000, duration:'1-2 jam' },
    { id:'S004', name:'Perbaikan Mesin',   desc:'Diagnosa dan perbaikan kerusakan mesin.',                       cost:500000, duration:'4-8 jam' },
    { id:'S005', name:'Servis Kelistrikan',desc:'Pemeriksaan dan perbaikan sistem kelistrikan kendaraan.',      cost:250000, duration:'2-4 jam' },
    { id:'S006', name:'Ganti Ban',         desc:'Penggantian ban kendaraan sesuai spesifikasi.',                  cost:300000, duration:'45 menit' },
    { id:'S007', name:'Tune Up',           desc:'Penyetelan mesin agar performa kendaraan tetap optimal.',       cost:175000, duration:'2 jam' },
    { id:'S008', name:'Servis AC',         desc:'Pembersihan dan pengisian freon AC kendaraan.',                 cost:350000, duration:'2-3 jam' },
  ];
  DB.set(DB.SERVICES, services);

  // Sample transactions
  const today = new Date().toISOString().split('T')[0];
  const transactions = [
    {
      id:'TRX001', serviceNo:'SVC-20250001',
      customerId:'C001', customerName:'Budi Santoso', customerPhone:'081234567890',
      vehicleId:'V001', vehiclePlate:'B 1234 ABC', vehicleBrand:'Toyota', vehicleModel:'Avanza',
      mechanicId:'M001', mechanicName:'Andi Prasetyo',
      serviceIds:['S001','S002'], serviceNames:['Servis Rutin','Ganti Oli Mesin'],
      totalCost:235000, dateIn:today, estDone:'', complaint:'Mesin terasa berat dan boros BBM',
      inspection:'Perlu servis rutin dan ganti oli', status:'Sedang Dikerjakan', createdAt:new Date().toISOString(),
    },
    {
      id:'TRX002', serviceNo:'SVC-20250002',
      customerId:'C002', customerName:'Siti Rahayu', customerPhone:'082345678901',
      vehicleId:'V002', vehiclePlate:'D 5678 XYZ', vehicleBrand:'Honda', vehicleModel:'Beat',
      mechanicId:'M003', mechanicName:'Joko Susanto',
      serviceIds:['S003'], serviceNames:['Perbaikan Rem'],
      totalCost:200000, dateIn:today, estDone:'', complaint:'Rem kurang pakem',
      inspection:'Kampas rem aus, perlu diganti', status:'Selesai', createdAt:new Date().toISOString(),
    },
  ];
  DB.set(DB.TRANSACTIONS, transactions);

  const payments = [
    {
      id:'PAY001', trxId:'TRX002', serviceNo:'SVC-20250002',
      customerId:'C002', customerName:'Siti Rahayu',
      totalCost:200000, paidAmount:200000, remaining:0,
      method:'Tunai', date:today, note:'Lunas', status:'Lunas',
    },
  ];
  DB.set(DB.PAYMENTS, payments);
}

// ===================================================
// 3. UTILITY HELPERS
// ===================================================
function genId(prefix, list) {
  const nums = list.map(i => parseInt((i.id || '').replace(prefix,'')) || 0);
  const next = (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
  return prefix + next;
}

function genServiceNo() {
  const trxs = DB.get(DB.TRANSACTIONS);
  const year  = new Date().getFullYear();
  const nums  = trxs.map(t => parseInt((t.serviceNo||'').split('-')[2]) || 0);
  const next  = (Math.max(0, ...nums) + 1).toString().padStart(7,'0');
  return `SVC-${year}${next}`;
}

function formatRp(n) {
  return 'Rp ' + Number(n||0).toLocaleString('id-ID');
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
}

// ===================================================
// 4. TOAST NOTIFICATION
// ===================================================
function showToast(msg, type = 'success') {
  const icons = { success:'✓', error:'✗', info:'ℹ', warning:'⚠' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]||'•'}</span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ===================================================
// 5. MODAL CONTROL
// ===================================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', e => {
    if (e.target === bd) bd.classList.remove('open');
  });
});

// ===================================================
// 6. NAVIGATION
// ===================================================
const pageNames = {
  dashboard:    'Dashboard',
  customers:    'Manajemen Pelanggan',
  vehicles:     'Manajemen Kendaraan',
  mechanics:    'Manajemen Mekanik',
  services:     'Layanan Servis',
  transactions: 'Transaksi Servis',
  payments:     'Pembayaran',
  history:      'Riwayat Servis',
};

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageNames[page] || page;

  // Refresh relevant module
  const renderers = {
    dashboard:    renderDashboard,
    customers:    renderCustomers,
    vehicles:     renderVehicles,
    mechanics:    renderMechanics,
    services:     renderServices,
    transactions: renderTransactions,
    payments:     renderPayments,
    history:      renderHistory,
  };
  renderers[page] && renderers[page]();

  // Close sidebar on mobile
  if (window.innerWidth < 900) closeSidebar();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

// Sidebar mobile toggle
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
});

// ===================================================
// 7. CLOCK
// ===================================================
function updateClock() {
  const now = new Date();
  document.getElementById('currentDateTime').textContent =
    now.toLocaleDateString('id-ID',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}) + '  ' +
    now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// ===================================================
// 8. DASHBOARD
// ===================================================
function renderDashboard() {
  const customers    = DB.get(DB.CUSTOMERS);
  const vehicles     = DB.get(DB.VEHICLES);
  const mechanics    = DB.get(DB.MECHANICS);
  const transactions = DB.get(DB.TRANSACTIONS);
  const payments     = DB.get(DB.PAYMENTS);

  const activeStatuses = ['Menunggu', 'Sedang Dikerjakan', 'Menunggu Suku Cadang'];
  const active = transactions.filter(t => activeStatuses.includes(t.status)).length;
  const done   = transactions.filter(t => t.status === 'Selesai').length;
  const revenue = payments.filter(p => p.status === 'Lunas').reduce((s,p) => s + (p.paidAmount||0), 0)
                + payments.filter(p => p.status === 'Sebagian').reduce((s,p) => s + (p.paidAmount||0), 0);

  document.getElementById('dash-total-customers').textContent = customers.length;
  document.getElementById('dash-total-vehicles').textContent  = vehicles.length;
  document.getElementById('dash-total-mechanics').textContent = mechanics.length;
  document.getElementById('dash-active-services').textContent = active;
  document.getElementById('dash-done-services').textContent   = done;
  document.getElementById('dash-total-revenue').textContent   = formatRp(revenue);

  // Recent transactions (latest 8)
  const recent = [...transactions].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8);
  const tbody = document.getElementById('dash-recent-tbody');
  tbody.innerHTML = recent.length ? recent.map(t => `
    <tr>
      <td>${t.serviceNo}</td>
      <td>${t.customerName}</td>
      <td>${t.vehiclePlate} (${t.vehicleBrand} ${t.vehicleModel})</td>
      <td>${(t.serviceNames||[]).join(', ')}</td>
      <td>${t.mechanicName}</td>
      <td>${formatDate(t.dateIn)}</td>
      <td>${statusBadge(t.status)}</td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="7">Belum ada transaksi servis.</td></tr>`;
}

// ===================================================
// 9. STATUS BADGES
// ===================================================
function statusBadge(status) {
  const map = {
    'Menunggu':             'badge-waiting',
    'Sedang Dikerjakan':    'badge-wip',
    'Menunggu Suku Cadang': 'badge-parts',
    'Selesai':              'badge-done',
    'Belum Dibayar':        'badge-unpaid',
    'Sebagian':             'badge-partial',
    'Lunas':                'badge-paid',
    'Tersedia':             'badge-avail',
    'Sibuk':                'badge-busy',
    'Cuti':                 'badge-leave',
  };
  return `<span class="badge ${map[status]||''}">${status}</span>`;
}

// ===================================================
// 10. CUSTOMERS MODULE
// ===================================================
function renderCustomers() {
  const q    = (document.getElementById('search-customers').value||'').toLowerCase();
  const list = DB.get(DB.CUSTOMERS).filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(q)
  );
  const tbody = document.getElementById('customers-tbody');
  tbody.innerHTML = list.length ? list.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email||'—'}</td>
      <td style="white-space:normal;max-width:200px">${c.address||'—'}</td>
      <td class="actions">
        <button class="btn btn-icon btn-edit"  onclick="editCustomer('${c.id}')"  title="Edit">✎</button>
        <button class="btn btn-icon btn-del"   onclick="deleteCustomer('${c.id}')" title="Hapus">✕</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="6">Tidak ada data pelanggan.</td></tr>`;
}

function openAddCustomer() {
  document.getElementById('modal-customer-title').textContent = 'Tambah Pelanggan';
  document.getElementById('cust-id').value    = '';
  document.getElementById('cust-name').value  = '';
  document.getElementById('cust-phone').value = '';
  document.getElementById('cust-email').value = '';
  document.getElementById('cust-address').value = '';
  openModal('modal-customer');
}

function editCustomer(id) {
  const c = DB.get(DB.CUSTOMERS).find(x => x.id === id);
  if (!c) return;
  document.getElementById('modal-customer-title').textContent = 'Edit Pelanggan';
  document.getElementById('cust-id').value      = c.id;
  document.getElementById('cust-name').value    = c.name;
  document.getElementById('cust-phone').value   = c.phone;
  document.getElementById('cust-email').value   = c.email||'';
  document.getElementById('cust-address').value = c.address||'';
  openModal('modal-customer');
}

function saveCustomer() {
  const id    = document.getElementById('cust-id').value.trim();
  const name  = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const addr  = document.getElementById('cust-address').value.trim();

  if (!name)  return showToast('Nama pelanggan wajib diisi.', 'error');
  if (!phone) return showToast('Nomor telepon wajib diisi.', 'error');

  let list = DB.get(DB.CUSTOMERS);
  if (id) {
    // Edit — update historical snapshot in vehicles, transactions
    list = list.map(c => c.id === id ? { ...c, name, phone, email, address:addr } : c);
    // Update vehicles ownerName
    let vehs = DB.get(DB.VEHICLES).map(v => v.ownerId === id ? { ...v, ownerName:name } : v);
    DB.set(DB.VEHICLES, vehs);
    showToast('Data pelanggan berhasil diperbarui.', 'success');
  } else {
    const newId = genId('C', list);
    list.push({ id:newId, name, phone, email, address:addr });
    showToast('Pelanggan baru berhasil ditambahkan.', 'success');
  }
  DB.set(DB.CUSTOMERS, list);
  closeModal('modal-customer');
  renderCustomers();
  renderDashboard();
}

function deleteCustomer(id) {
  if (!confirm('Hapus data pelanggan ini? Riwayat transaksi terkait tetap tersimpan.')) return;
  let list = DB.get(DB.CUSTOMERS).filter(c => c.id !== id);
  DB.set(DB.CUSTOMERS, list);
  showToast('Pelanggan berhasil dihapus.', 'info');
  renderCustomers();
  renderDashboard();
}

// ===================================================
// 11. VEHICLES MODULE
// ===================================================
function renderVehicles() {
  const q    = (document.getElementById('search-vehicles').value||'').toLowerCase();
  const list = DB.get(DB.VEHICLES).filter(v =>
    v.plate.toLowerCase().includes(q) || v.ownerName.toLowerCase().includes(q)
  );
  const tbody = document.getElementById('vehicles-tbody');
  tbody.innerHTML = list.length ? list.map(v => `
    <tr>
      <td><strong>${v.plate}</strong></td>
      <td>${v.ownerName}</td>
      <td>${v.brand}</td>
      <td>${v.model}</td>
      <td>${v.year}</td>
      <td>${v.type}</td>
      <td class="actions">
        <button class="btn btn-icon btn-edit" onclick="editVehicle('${v.id}')"   title="Edit">✎</button>
        <button class="btn btn-icon btn-del"  onclick="deleteVehicle('${v.id}')" title="Hapus">✕</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="7">Tidak ada data kendaraan.</td></tr>`;
}

function populateOwnerSelect(selectedId) {
  const sel = document.getElementById('veh-owner');
  sel.innerHTML = '<option value="">-- Pilih Pemilik --</option>';
  DB.get(DB.CUSTOMERS).forEach(c => {
    sel.innerHTML += `<option value="${c.id}" ${c.id===selectedId?'selected':''}>${c.name}</option>`;
  });
}

function openAddVehicle() {
  document.getElementById('modal-vehicle-title').textContent = 'Tambah Kendaraan';
  document.getElementById('veh-id').value     = '';
  document.getElementById('veh-plate').value  = '';
  document.getElementById('veh-brand').value  = '';
  document.getElementById('veh-model').value  = '';
  document.getElementById('veh-year').value   = '';
  document.getElementById('veh-color').value  = '';
  document.getElementById('veh-type').value   = '';
  populateOwnerSelect('');
  openModal('modal-vehicle');
}

function editVehicle(id) {
  const v = DB.get(DB.VEHICLES).find(x => x.id === id);
  if (!v) return;
  document.getElementById('modal-vehicle-title').textContent = 'Edit Kendaraan';
  document.getElementById('veh-id').value    = v.id;
  document.getElementById('veh-plate').value = v.plate;
  document.getElementById('veh-brand').value = v.brand;
  document.getElementById('veh-model').value = v.model;
  document.getElementById('veh-year').value  = v.year;
  document.getElementById('veh-color').value = v.color||'';
  document.getElementById('veh-type').value  = v.type;
  populateOwnerSelect(v.ownerId);
  openModal('modal-vehicle');
}

function saveVehicle() {
  const id      = document.getElementById('veh-id').value.trim();
  const plate   = document.getElementById('veh-plate').value.trim().toUpperCase();
  const ownerId = document.getElementById('veh-owner').value;
  const brand   = document.getElementById('veh-brand').value.trim();
  const model   = document.getElementById('veh-model').value.trim();
  const year    = document.getElementById('veh-year').value.trim();
  const type    = document.getElementById('veh-type').value;
  const color   = document.getElementById('veh-color').value.trim();

  if (!plate)   return showToast('Nomor polisi wajib diisi.', 'error');
  if (!ownerId) return showToast('Pemilik kendaraan wajib dipilih.', 'error');
  if (!brand)   return showToast('Merek kendaraan wajib diisi.', 'error');
  if (!model)   return showToast('Model kendaraan wajib diisi.', 'error');
  if (!year)    return showToast('Tahun kendaraan wajib diisi.', 'error');
  if (!type)    return showToast('Jenis kendaraan wajib dipilih.', 'error');

  const owner = DB.get(DB.CUSTOMERS).find(c => c.id === ownerId);
  const ownerName = owner ? owner.name : '';
  let list = DB.get(DB.VEHICLES);

  if (id) {
    list = list.map(v => v.id === id ? { ...v, plate, ownerId, ownerName, brand, model, year:+year, type, color } : v);
    showToast('Data kendaraan berhasil diperbarui.', 'success');
  } else {
    // Unique plate check
    if (list.find(v => v.plate === plate)) return showToast('Nomor polisi sudah terdaftar.', 'error');
    list.push({ id:genId('V',list), plate, ownerId, ownerName, brand, model, year:+year, type, color });
    showToast('Kendaraan baru berhasil ditambahkan.', 'success');
  }
  DB.set(DB.VEHICLES, list);
  closeModal('modal-vehicle');
  renderVehicles();
  renderDashboard();
}

function deleteVehicle(id) {
  if (!confirm('Hapus data kendaraan ini? Riwayat transaksi terkait tetap tersimpan.')) return;
  DB.set(DB.VEHICLES, DB.get(DB.VEHICLES).filter(v => v.id !== id));
  showToast('Kendaraan berhasil dihapus.', 'info');
  renderVehicles();
  renderDashboard();
}

// ===================================================
// 12. MECHANICS MODULE
// ===================================================
function renderMechanics() {
  const q    = (document.getElementById('search-mechanics').value||'').toLowerCase();
  const list = DB.get(DB.MECHANICS).filter(m =>
    m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
  );
  const tbody = document.getElementById('mechanics-tbody');
  tbody.innerHTML = list.length ? list.map(m => `
    <tr>
      <td>${m.id}</td>
      <td>${m.name}</td>
      <td>${m.phone}</td>
      <td>${m.spec}</td>
      <td>${statusBadge(m.status)}</td>
      <td class="actions">
        <button class="btn btn-icon btn-edit" onclick="editMechanic('${m.id}')"   title="Edit">✎</button>
        <button class="btn btn-icon btn-del"  onclick="deleteMechanic('${m.id}')" title="Hapus">✕</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="6">Tidak ada data mekanik.</td></tr>`;
}

function openAddMechanic() {
  document.getElementById('modal-mechanic-title').textContent = 'Tambah Mekanik';
  document.getElementById('mec-id').value     = '';
  document.getElementById('mec-name').value   = '';
  document.getElementById('mec-phone').value  = '';
  document.getElementById('mec-spec').value   = '';
  document.getElementById('mec-status').value = 'Tersedia';
  openModal('modal-mechanic');
}

function editMechanic(id) {
  const m = DB.get(DB.MECHANICS).find(x => x.id === id);
  if (!m) return;
  document.getElementById('modal-mechanic-title').textContent = 'Edit Mekanik';
  document.getElementById('mec-id').value     = m.id;
  document.getElementById('mec-name').value   = m.name;
  document.getElementById('mec-phone').value  = m.phone;
  document.getElementById('mec-spec').value   = m.spec;
  document.getElementById('mec-status').value = m.status;
  openModal('modal-mechanic');
}

function saveMechanic() {
  const id     = document.getElementById('mec-id').value.trim();
  const name   = document.getElementById('mec-name').value.trim();
  const phone  = document.getElementById('mec-phone').value.trim();
  const spec   = document.getElementById('mec-spec').value;
  const status = document.getElementById('mec-status').value;

  if (!name)  return showToast('Nama mekanik wajib diisi.', 'error');
  if (!phone) return showToast('Nomor telepon wajib diisi.', 'error');
  if (!spec)  return showToast('Spesialisasi wajib dipilih.', 'error');

  let list = DB.get(DB.MECHANICS);
  if (id) {
    list = list.map(m => m.id === id ? { ...m, name, phone, spec, status } : m);
    showToast('Data mekanik berhasil diperbarui.', 'success');
  } else {
    list.push({ id:genId('M',list), name, phone, spec, status });
    showToast('Mekanik baru berhasil ditambahkan.', 'success');
  }
  DB.set(DB.MECHANICS, list);
  closeModal('modal-mechanic');
  renderMechanics();
  renderDashboard();
}

function deleteMechanic(id) {
  if (!confirm('Hapus data mekanik ini? Riwayat transaksi terkait tetap tersimpan.')) return;
  DB.set(DB.MECHANICS, DB.get(DB.MECHANICS).filter(m => m.id !== id));
  showToast('Mekanik berhasil dihapus.', 'info');
  renderMechanics();
  renderDashboard();
}

// ===================================================
// 13. SERVICE TYPES MODULE
// ===================================================
function renderServices() {
  const q    = (document.getElementById('search-services').value||'').toLowerCase();
  const list = DB.get(DB.SERVICES).filter(s =>
    s.name.toLowerCase().includes(q)
  );
  const tbody = document.getElementById('services-tbody');
  tbody.innerHTML = list.length ? list.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong></td>
      <td style="white-space:normal;max-width:250px">${s.desc||'—'}</td>
      <td>${formatRp(s.cost)}</td>
      <td>${s.duration}</td>
      <td class="actions">
        <button class="btn btn-icon btn-edit" onclick="editServiceType('${s.id}')"   title="Edit">✎</button>
        <button class="btn btn-icon btn-del"  onclick="deleteServiceType('${s.id}')" title="Hapus">✕</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="6">Tidak ada data layanan servis.</td></tr>`;
}

function openAddServiceType() {
  document.getElementById('modal-service-title').textContent = 'Tambah Layanan';
  document.getElementById('svc-id').value    = '';
  document.getElementById('svc-name').value  = '';
  document.getElementById('svc-desc').value  = '';
  document.getElementById('svc-cost').value  = '';
  document.getElementById('svc-duration').value = '';
  openModal('modal-service');
}

function editServiceType(id) {
  const s = DB.get(DB.SERVICES).find(x => x.id === id);
  if (!s) return;
  document.getElementById('modal-service-title').textContent = 'Edit Layanan';
  document.getElementById('svc-id').value    = s.id;
  document.getElementById('svc-name').value  = s.name;
  document.getElementById('svc-desc').value  = s.desc||'';
  document.getElementById('svc-cost').value  = s.cost;
  document.getElementById('svc-duration').value = s.duration;
  openModal('modal-service');
}

function saveServiceType() {
  const id       = document.getElementById('svc-id').value.trim();
  const name     = document.getElementById('svc-name').value.trim();
  const desc     = document.getElementById('svc-desc').value.trim();
  const cost     = parseFloat(document.getElementById('svc-cost').value);
  const duration = document.getElementById('svc-duration').value.trim();

  if (!name)         return showToast('Nama layanan wajib diisi.', 'error');
  if (isNaN(cost))   return showToast('Estimasi biaya wajib diisi.', 'error');
  if (!duration)     return showToast('Estimasi waktu wajib diisi.', 'error');

  let list = DB.get(DB.SERVICES);
  if (id) {
    list = list.map(s => s.id === id ? { ...s, name, desc, cost, duration } : s);
    showToast('Layanan berhasil diperbarui.', 'success');
  } else {
    list.push({ id:genId('S',list), name, desc, cost, duration });
    showToast('Layanan baru berhasil ditambahkan.', 'success');
  }
  DB.set(DB.SERVICES, list);
  closeModal('modal-service');
  renderServices();
}

function deleteServiceType(id) {
  if (!confirm('Hapus layanan ini? Riwayat transaksi terkait tetap tersimpan.')) return;
  DB.set(DB.SERVICES, DB.get(DB.SERVICES).filter(s => s.id !== id));
  showToast('Layanan berhasil dihapus.', 'info');
  renderServices();
}

// ===================================================
// 14. TRANSACTIONS MODULE
// ===================================================
function populateTrxDropdowns() {
  // Customers
  const cSel = document.getElementById('trx-customer');
  const cur   = cSel.value;
  cSel.innerHTML = '<option value="">-- Pilih Pelanggan --</option>';
  DB.get(DB.CUSTOMERS).forEach(c => {
    cSel.innerHTML += `<option value="${c.id}" ${c.id===cur?'selected':''}>${c.name}</option>`;
  });

  // Mechanics
  const mSel = document.getElementById('trx-mechanic');
  const mCur  = mSel.value;
  mSel.innerHTML = '<option value="">-- Pilih Mekanik --</option>';
  DB.get(DB.MECHANICS).forEach(m => {
    mSel.innerHTML += `<option value="${m.id}" ${m.id===mCur?'selected':''}>${m.name} (${m.spec})</option>`;
  });

  // Services checklist
  const container = document.getElementById('trx-services-checklist');
  const prevChecked = Array.from(container.querySelectorAll('input:checked')).map(i=>i.value);
  container.innerHTML = '';
  DB.get(DB.SERVICES).forEach(s => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `
      <input type="checkbox" value="${s.id}" ${prevChecked.includes(s.id)?'checked':''}
             onchange="recalcTrxTotal()" />
      <span><strong>${s.name}</strong> — ${formatRp(s.cost)}</span>`;
    container.appendChild(lbl);
  });
}

function populateTrxVehicles() {
  const custId = document.getElementById('trx-customer').value;
  const vSel   = document.getElementById('trx-vehicle');
  vSel.innerHTML = '<option value="">-- Pilih Kendaraan --</option>';
  DB.get(DB.VEHICLES).filter(v => v.ownerId === custId).forEach(v => {
    vSel.innerHTML += `<option value="${v.id}">${v.plate} — ${v.brand} ${v.model}</option>`;
  });
}

function recalcTrxTotal() {
  const checked = Array.from(document.querySelectorAll('#trx-services-checklist input:checked')).map(i=>i.value);
  const services = DB.get(DB.SERVICES);
  const total = checked.reduce((s,id) => {
    const svc = services.find(x=>x.id===id);
    return s + (svc ? svc.cost : 0);
  }, 0);
  document.getElementById('trx-total').value = formatRp(total);
}

function openAddTransaction() {
  document.getElementById('modal-transaction-title').textContent = 'Buat Transaksi Servis';
  document.getElementById('trx-id').value         = '';
  document.getElementById('trx-vehicle').innerHTML = '<option value="">-- Pilih Kendaraan --</option>';
  document.getElementById('trx-date-in').value    = new Date().toISOString().split('T')[0];
  document.getElementById('trx-est-done').value   = '';
  document.getElementById('trx-complaint').value  = '';
  document.getElementById('trx-inspection').value = '';
  document.getElementById('trx-status').value     = 'Menunggu';
  document.getElementById('trx-total').value      = 'Rp 0';
  populateTrxDropdowns();
  openModal('modal-transaction');
}

function editTransaction(id) {
  const t = DB.get(DB.TRANSACTIONS).find(x => x.id === id);
  if (!t) return;
  document.getElementById('modal-transaction-title').textContent = 'Edit Transaksi Servis';
  document.getElementById('trx-id').value         = t.id;
  document.getElementById('trx-date-in').value    = t.dateIn||'';
  document.getElementById('trx-est-done').value   = t.estDone||'';
  document.getElementById('trx-complaint').value  = t.complaint||'';
  document.getElementById('trx-inspection').value = t.inspection||'';
  document.getElementById('trx-status').value     = t.status;

  populateTrxDropdowns();

  // Set customer & reload vehicles
  document.getElementById('trx-customer').value = t.customerId;
  populateTrxVehicles();
  document.getElementById('trx-vehicle').value  = t.vehicleId;
  document.getElementById('trx-mechanic').value = t.mechanicId;

  // Check previously selected services
  document.querySelectorAll('#trx-services-checklist input').forEach(cb => {
    cb.checked = (t.serviceIds||[]).includes(cb.value);
  });
  recalcTrxTotal();
  openModal('modal-transaction');
}

function saveTransaction() {
  const id         = document.getElementById('trx-id').value.trim();
  const customerId = document.getElementById('trx-customer').value;
  const vehicleId  = document.getElementById('trx-vehicle').value;
  const mechanicId = document.getElementById('trx-mechanic').value;
  const dateIn     = document.getElementById('trx-date-in').value;
  const estDone    = document.getElementById('trx-est-done').value;
  const complaint  = document.getElementById('trx-complaint').value.trim();
  const inspection = document.getElementById('trx-inspection').value.trim();
  const status     = document.getElementById('trx-status').value;

  const checkedIds = Array.from(document.querySelectorAll('#trx-services-checklist input:checked')).map(i=>i.value);

  if (!customerId)          return showToast('Pelanggan wajib dipilih.', 'error');
  if (!vehicleId)           return showToast('Kendaraan wajib dipilih.', 'error');
  if (!mechanicId)          return showToast('Mekanik wajib dipilih.', 'error');
  if (!dateIn)              return showToast('Tanggal masuk wajib diisi.', 'error');
  if (!checkedIds.length)   return showToast('Pilih minimal satu layanan servis.', 'error');

  const customer  = DB.get(DB.CUSTOMERS).find(c => c.id === customerId) || {};
  const vehicle   = DB.get(DB.VEHICLES).find(v => v.id === vehicleId)   || {};
  const mechanic  = DB.get(DB.MECHANICS).find(m => m.id === mechanicId) || {};
  const svcs      = DB.get(DB.SERVICES);
  const selSvcs   = checkedIds.map(sid => svcs.find(s=>s.id===sid)).filter(Boolean);
  const totalCost = selSvcs.reduce((s,sv) => s+sv.cost, 0);

  let list = DB.get(DB.TRANSACTIONS);

  const record = {
    customerId,   customerName:customer.name||'', customerPhone:customer.phone||'',
    vehicleId,    vehiclePlate:vehicle.plate||'',  vehicleBrand:vehicle.brand||'', vehicleModel:vehicle.model||'',
    mechanicId,   mechanicName:mechanic.name||'',
    serviceIds:checkedIds, serviceNames:selSvcs.map(s=>s.name),
    totalCost, dateIn, estDone, complaint, inspection, status,
  };

  if (id) {
    list = list.map(t => t.id===id ? { ...t, ...record } : t);
    showToast('Transaksi berhasil diperbarui.', 'success');
  } else {
    record.id         = genId('TRX', list);
    record.serviceNo  = genServiceNo();
    record.createdAt  = new Date().toISOString();
    list.push(record);
    showToast('Transaksi servis berhasil dibuat.', 'success');
  }
  DB.set(DB.TRANSACTIONS, list);
  closeModal('modal-transaction');
  renderTransactions();
  renderDashboard();
}

function deleteTransaction(id) {
  if (!confirm('Hapus transaksi ini? Data pembayaran terkait juga akan dihapus.')) return;
  DB.set(DB.TRANSACTIONS, DB.get(DB.TRANSACTIONS).filter(t => t.id !== id));
  DB.set(DB.PAYMENTS, DB.get(DB.PAYMENTS).filter(p => p.trxId !== id));
  showToast('Transaksi berhasil dihapus.', 'info');
  renderTransactions();
  renderPayments();
  renderDashboard();
}

function updateTrxStatus(id) {
  const t = DB.get(DB.TRANSACTIONS).find(x => x.id === id);
  if (!t) return;
  const opts = ['Menunggu','Sedang Dikerjakan','Menunggu Suku Cadang','Selesai'];
  const cur  = opts.indexOf(t.status);
  const next = opts[(cur+1) % opts.length];
  if (!confirm(`Ubah status menjadi "${next}"?`)) return;
  DB.set(DB.TRANSACTIONS, DB.get(DB.TRANSACTIONS).map(x => x.id===id ? {...x,status:next} : x));
  showToast(`Status diperbarui: ${next}`, 'success');
  renderTransactions();
  renderDashboard();
  renderHistory();
}

function viewTransaction(id) {
  const t = DB.get(DB.TRANSACTIONS).find(x => x.id === id);
  if (!t) return;
  const pay = DB.get(DB.PAYMENTS).filter(p => p.trxId === id);
  const paidTotal = pay.reduce((s,p) => s+p.paidAmount, 0);
  const payStatus = paidTotal >= t.totalCost ? 'Lunas' : paidTotal > 0 ? 'Sebagian' : 'Belum Dibayar';

  document.getElementById('trx-detail-content').innerHTML = `
    <div class="detail-section">
      <h4>Informasi Servis</h4>
      <div class="detail-grid">
        <div class="detail-row"><span class="dl">No. Servis:</span><span class="dv">${t.serviceNo}</span></div>
        <div class="detail-row"><span class="dl">Status:</span><span class="dv">${statusBadge(t.status)}</span></div>
        <div class="detail-row"><span class="dl">Tgl Masuk:</span><span class="dv">${formatDate(t.dateIn)}</span></div>
        <div class="detail-row"><span class="dl">Est. Selesai:</span><span class="dv">${formatDate(t.estDone)}</span></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Pelanggan & Kendaraan</h4>
      <div class="detail-grid">
        <div class="detail-row"><span class="dl">Pelanggan:</span><span class="dv">${t.customerName}</span></div>
        <div class="detail-row"><span class="dl">Telepon:</span><span class="dv">${t.customerPhone}</span></div>
        <div class="detail-row"><span class="dl">No. Polisi:</span><span class="dv">${t.vehiclePlate}</span></div>
        <div class="detail-row"><span class="dl">Kendaraan:</span><span class="dv">${t.vehicleBrand} ${t.vehicleModel}</span></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Mekanik & Layanan</h4>
      <div class="detail-row"><span class="dl">Mekanik:</span><span class="dv">${t.mechanicName}</span></div>
      <div class="detail-row" style="margin-top:.4rem"><span class="dl">Layanan:</span>
        <span class="dv">${(t.serviceNames||[]).map(n=>`<span class="badge badge-wip" style="margin:2px">${n}</span>`).join(' ')}</span>
      </div>
      <div class="detail-row" style="margin-top:.5rem"><span class="dl">Total Biaya:</span><span class="dv" style="color:var(--accent);font-weight:700">${formatRp(t.totalCost)}</span></div>
    </div>
    <div class="detail-section">
      <h4>Keluhan & Pemeriksaan</h4>
      <div class="detail-row" style="flex-direction:column;gap:.2rem"><span class="dl">Keluhan:</span><span class="dv">${t.complaint||'—'}</span></div>
      <div class="detail-row" style="flex-direction:column;gap:.2rem;margin-top:.5rem"><span class="dl">Pemeriksaan:</span><span class="dv">${t.inspection||'—'}</span></div>
    </div>
    <div class="detail-section">
      <h4>Status Pembayaran</h4>
      <div class="detail-grid">
        <div class="detail-row"><span class="dl">Total Biaya:</span><span class="dv">${formatRp(t.totalCost)}</span></div>
        <div class="detail-row"><span class="dl">Terbayar:</span><span class="dv" style="color:var(--green)">${formatRp(paidTotal)}</span></div>
        <div class="detail-row"><span class="dl">Sisa:</span><span class="dv" style="color:var(--accent)">${formatRp(t.totalCost - paidTotal)}</span></div>
        <div class="detail-row"><span class="dl">Status:</span><span class="dv">${statusBadge(payStatus)}</span></div>
      </div>
    </div>`;
  openModal('modal-trx-detail');
}

function renderTransactions() {
  const q    = (document.getElementById('search-transactions').value||'').toLowerCase();
  const fSt  = document.getElementById('filter-trx-status').value;
  let list   = DB.get(DB.TRANSACTIONS).filter(t =>
    (t.serviceNo.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q)) &&
    (!fSt || t.status === fSt)
  ).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));

  const tbody = document.getElementById('transactions-tbody');
  tbody.innerHTML = list.length ? list.map(t => `
    <tr>
      <td>${t.serviceNo}</td>
      <td>${t.customerName}</td>
      <td>${t.vehiclePlate}</td>
      <td>${t.mechanicName}</td>
      <td>${formatDate(t.dateIn)}</td>
      <td style="color:var(--accent);font-weight:600">${formatRp(t.totalCost)}</td>
      <td>${statusBadge(t.status)}</td>
      <td class="actions">
        <button class="btn btn-icon btn-view"   onclick="viewTransaction('${t.id}')"     title="Detail">👁</button>
        <button class="btn btn-icon btn-status" onclick="updateTrxStatus('${t.id}')"     title="Update Status">↻</button>
        <button class="btn btn-icon btn-edit"   onclick="editTransaction('${t.id}')"     title="Edit">✎</button>
        <button class="btn btn-icon btn-del"    onclick="deleteTransaction('${t.id}')"   title="Hapus">✕</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="8">Tidak ada transaksi servis.</td></tr>`;
}

// ===================================================
// 15. PAYMENTS MODULE
// ===================================================
function populatePaymentTrxSelect(selectedId) {
  const sel = document.getElementById('pay-select-trx');
  const cur = sel.value;
  sel.innerHTML = '<option value="">-- Pilih No. Servis --</option>';
  // Show all transactions that aren't fully paid
  DB.get(DB.TRANSACTIONS).forEach(t => {
    const pays = DB.get(DB.PAYMENTS).filter(p => p.trxId === t.id);
    const paid = pays.reduce((s,p) => s+p.paidAmount, 0);
    if (paid < t.totalCost || t.id === selectedId) {
      sel.innerHTML += `<option value="${t.id}" ${t.id===selectedId?'selected':''}>${t.serviceNo} — ${t.customerName}</option>`;
    }
  });
}

function openAddPayment() {
  document.getElementById('pay-trx-id').value = '';
  document.getElementById('pay-amount').value = '';
  document.getElementById('pay-note').value   = '';
  document.getElementById('pay-date').value   = new Date().toISOString().split('T')[0];
  document.getElementById('pay-method').value = 'Tunai';
  document.getElementById('pay-info-box').style.display = 'none';
  populatePaymentTrxSelect('');
  openModal('modal-payment');
}

function populatePaymentInfo() {
  const trxId = document.getElementById('pay-select-trx').value;
  const box   = document.getElementById('pay-info-box');
  if (!trxId) { box.style.display = 'none'; return; }
  const t     = DB.get(DB.TRANSACTIONS).find(x => x.id === trxId);
  if (!t) { box.style.display = 'none'; return; }
  const pays  = DB.get(DB.PAYMENTS).filter(p => p.trxId === trxId);
  const paid  = pays.reduce((s,p) => s+p.paidAmount, 0);
  document.getElementById('pay-info-customer').textContent  = t.customerName;
  document.getElementById('pay-info-vehicle').textContent   = `${t.vehiclePlate} — ${t.vehicleBrand} ${t.vehicleModel}`;
  document.getElementById('pay-info-total').textContent     = formatRp(t.totalCost);
  document.getElementById('pay-info-paid').textContent      = formatRp(paid);
  document.getElementById('pay-info-remaining').textContent = formatRp(t.totalCost - paid);
  box.style.display = 'block';
}

function updatePaymentRemaining() {
  const trxId = document.getElementById('pay-select-trx').value;
  if (!trxId) return;
  const t    = DB.get(DB.TRANSACTIONS).find(x => x.id === trxId);
  if (!t) return;
  const pays = DB.get(DB.PAYMENTS).filter(p => p.trxId === trxId);
  const paid = pays.reduce((s,p) => s+p.paidAmount, 0);
  const amt  = parseFloat(document.getElementById('pay-amount').value)||0;
  document.getElementById('pay-info-remaining').textContent = formatRp(t.totalCost - paid - amt);
}

function savePayment() {
  const trxId  = document.getElementById('pay-select-trx').value;
  const amount = parseFloat(document.getElementById('pay-amount').value);
  const method = document.getElementById('pay-method').value;
  const date   = document.getElementById('pay-date').value;
  const note   = document.getElementById('pay-note').value.trim();

  if (!trxId)       return showToast('Pilih nomor servis.', 'error');
  if (isNaN(amount)||amount<=0) return showToast('Jumlah pembayaran wajib diisi.', 'error');
  if (!date)        return showToast('Tanggal pembayaran wajib diisi.', 'error');

  const t    = DB.get(DB.TRANSACTIONS).find(x => x.id === trxId);
  if (!t) return showToast('Transaksi tidak ditemukan.', 'error');

  const prevPays = DB.get(DB.PAYMENTS).filter(p => p.trxId === trxId);
  const prevPaid = prevPays.reduce((s,p) => s+p.paidAmount, 0);

  if (prevPaid + amount > t.totalCost) {
    return showToast(`Jumlah melebihi sisa tagihan (${formatRp(t.totalCost - prevPaid)}).`, 'error');
  }

  const newPaid   = prevPaid + amount;
  const remaining = t.totalCost - newPaid;
  const status    = remaining <= 0 ? 'Lunas' : newPaid > 0 ? 'Sebagian' : 'Belum Dibayar';

  const list = DB.get(DB.PAYMENTS);
  list.push({
    id: genId('PAY', list),
    trxId, serviceNo:t.serviceNo,
    customerId:t.customerId, customerName:t.customerName,
    totalCost:t.totalCost, paidAmount:amount, remaining,
    method, date, note, status,
    createdAt: new Date().toISOString(),
  });
  DB.set(DB.PAYMENTS, list);
  showToast(`Pembayaran ${formatRp(amount)} berhasil dicatat. Status: ${status}`, 'success');
  closeModal('modal-payment');
  renderPayments();
  renderDashboard();
}

function deletePayment(id) {
  if (!confirm('Hapus catatan pembayaran ini?')) return;
  DB.set(DB.PAYMENTS, DB.get(DB.PAYMENTS).filter(p => p.id !== id));
  showToast('Catatan pembayaran dihapus.', 'info');
  renderPayments();
  renderDashboard();
}

function renderPayments() {
  const q   = (document.getElementById('search-payments').value||'').toLowerCase();
  const fSt = document.getElementById('filter-pay-status').value;

  // Build summary per transaction
  const trxs = DB.get(DB.TRANSACTIONS);
  const allPays = DB.get(DB.PAYMENTS);

  // Group payments by trxId to show total paid per transaction
  const trxPayMap = {};
  allPays.forEach(p => {
    if (!trxPayMap[p.trxId]) trxPayMap[p.trxId] = { paid:0, methods:[], dates:[], ids:[] };
    trxPayMap[p.trxId].paid     += p.paidAmount;
    trxPayMap[p.trxId].methods.push(p.method);
    trxPayMap[p.trxId].dates.push(p.date);
    trxPayMap[p.trxId].ids.push(p.id);
  });

  let rows = trxs.map(t => {
    const pm     = trxPayMap[t.id] || { paid:0, methods:[], dates:[], ids:[] };
    const paid   = pm.paid;
    const remain = t.totalCost - paid;
    const pSt    = paid >= t.totalCost ? 'Lunas' : paid > 0 ? 'Sebagian' : 'Belum Dibayar';
    return { t, paid, remain, pSt, methods:pm.methods, ids:pm.ids };
  }).filter(r =>
    (r.t.serviceNo.toLowerCase().includes(q) || r.t.customerName.toLowerCase().includes(q)) &&
    (!fSt || r.pSt === fSt)
  ).sort((a,b) => new Date(b.t.createdAt)-new Date(a.t.createdAt));

  const tbody = document.getElementById('payments-tbody');
  tbody.innerHTML = rows.length ? rows.map(({t,paid,remain,pSt,methods}) => `
    <tr>
      <td>${t.serviceNo}</td>
      <td>${t.customerName}</td>
      <td style="color:var(--accent);font-weight:600">${formatRp(t.totalCost)}</td>
      <td style="color:var(--green)">${formatRp(paid)}</td>
      <td style="color:${remain>0?'var(--accent)':'var(--muted)'}">${formatRp(remain)}</td>
      <td>${[...new Set(methods)].join(', ')||'—'}</td>
      <td>${statusBadge(pSt)}</td>
      <td class="actions">
        ${pSt !== 'Lunas' ? `<button class="btn btn-icon btn-pay" onclick="quickPay('${t.id}')" title="Bayar">💳</button>` : ''}
        <button class="btn btn-icon btn-view" onclick="viewTransaction('${t.id}')" title="Detail">👁</button>
      </td>
    </tr>`).join('')
    : `<tr class="empty-row"><td colspan="8">Tidak ada data pembayaran.</td></tr>`;
}

function quickPay(trxId) {
  // Pre-fill payment modal with the selected trx
  document.getElementById('pay-trx-id').value = '';
  document.getElementById('pay-amount').value = '';
  document.getElementById('pay-note').value   = '';
  document.getElementById('pay-date').value   = new Date().toISOString().split('T')[0];
  document.getElementById('pay-method').value = 'Tunai';
  populatePaymentTrxSelect(trxId);
  document.getElementById('pay-select-trx').value = trxId;
  populatePaymentInfo();
  openModal('modal-payment');
}

// ===================================================
// 16. HISTORY MODULE
// ===================================================
function renderHistory() {
  const q    = (document.getElementById('search-history').value||'').toLowerCase();
  const fDt  = document.getElementById('filter-history-date').value;
  const fSt  = document.getElementById('filter-history-status').value;

  const allPays = DB.get(DB.PAYMENTS);
  const trxPayMap = {};
  allPays.forEach(p => {
    if (!trxPayMap[p.trxId]) trxPayMap[p.trxId] = 0;
    trxPayMap[p.trxId] += p.paidAmount;
  });

  let list = DB.get(DB.TRANSACTIONS).filter(t => {
    const matchQ  = t.customerName.toLowerCase().includes(q) || t.vehiclePlate.toLowerCase().includes(q) || t.serviceNo.toLowerCase().includes(q);
    const matchDt = !fDt || t.dateIn === fDt;
    const matchSt = !fSt || t.status === fSt;
    return matchQ && matchDt && matchSt;
  }).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));

  const tbody = document.getElementById('history-tbody');
  tbody.innerHTML = list.length ? list.map(t => {
    const paid   = trxPayMap[t.id]||0;
    const payStatus = paid >= t.totalCost ? 'Lunas' : paid > 0 ? 'Sebagian' : 'Belum Dibayar';
    return `<tr>
      <td>${t.serviceNo}</td>
      <td>${t.customerName}</td>
      <td><strong>${t.vehiclePlate}</strong></td>
      <td>${t.mechanicName}</td>
      <td style="white-space:normal;max-width:200px">${(t.serviceNames||[]).join(', ')}</td>
      <td>${formatDate(t.dateIn)}</td>
      <td style="color:var(--accent);font-weight:600">${formatRp(t.totalCost)}</td>
      <td>${statusBadge(t.status)}</td>
      <td>${statusBadge(payStatus)}</td>
    </tr>`;
  }).join('')
    : `<tr class="empty-row"><td colspan="9">Tidak ada riwayat servis yang cocok.</td></tr>`;
}

// ===================================================
// 17. INIT
// ===================================================
function init() {
  seedData();
  renderDashboard();
}

init();
