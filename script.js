var MY_PHONE_NUMBER = "963994287303"; 
var ADMIN_PASSWORD = "alnsrziko"; 
var IMGBB_API_KEY = "3a830155b4104b90e9d69bd8cb94b476"; 

localStorage.removeItem('ziko_games_data');

var defaultGamesData = [
  { 
    id: 'pubg', 
    name: 'ببجي موبايل', 
    packages: [
      { name: '60 شدات', price: 'السعر حسب الطلب' },
      { name: '325 شدات', price: 'السعر حسب الطلب' },
      { name: '660 شدات', price: 'السعر حسب الطلب' },
      { name: '1800 شدات', price: 'السعر حسب الطلب' },
      { name: 'الرويال باس', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'freefire', 
    name: 'فري فاير', 
    packages: [
      { name: '100 مجوهرات', price: 'السعر حسب الطلب' },
      { name: '210 مجوهرات', price: 'السعر حسب الطلب' },
      { name: '530 مجوهرات', price: 'السعر حسب الطلب' },
      { name: '1080 مجوهرات', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'roblox', 
    name: 'روبلوكس', 
    packages: [
      { name: '80 Robux', price: 'السعر حسب الطلب' },
      { name: '400 Robux', price: 'السعر حسب الطلب' },
      { name: '800 Robux', price: 'السعر حسب الطلب' },
      { name: '1700 Robux', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'fifa', 
    name: 'فيفا موبايل (FC)', 
    packages: [
      { name: '100 FC Points', price: 'السعر حسب الطلب' },
      { name: '520 FC Points', price: 'السعر حسب الطلب' },
      { name: '1070 FC Points', price: 'السعر حسب الطلب' },
      { name: 'Star Pass', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'cod', 
    name: 'كول اوف ديوتي', 
    packages: [
      { name: '80 CP', price: 'السعر حسب الطلب' },
      { name: '420 CP', price: 'السعر حسب الطلب' },
      { name: '880 CP', price: 'السعر حسب الطلب' },
      { name: '2400 CP', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'mlbb', 
    name: 'موبايل ليجند', 
    packages: [
      { name: '50 ماسة', price: 'السعر حسب الطلب' },
      { name: '250 ماسة', price: 'السعر حسب الطلب' },
      { name: '500 ماسة', price: 'السعر حسب الطلب' },
      { name: 'بطاقة العضوية', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'jawaker', 
    name: 'جواكر', 
    packages: [
      { name: '10,000 توكنز', price: 'السعر حسب الطلب' },
      { name: '50,000 توكنز', price: 'السعر حسب الطلب' },
      { name: '250,000 توكنز', price: 'السعر حسب الطلب' },
      { name: 'باشا شهر', price: 'السعر حسب الطلب' }
    ] 
  },
  { 
    id: 'pool8', 
    name: '8 Ball Pool', 
    packages: [
      { name: '100,000 كوينز', price: 'السعر حسب الطلب' },
      { name: '1,000,000 كوينز', price: 'السعر حسب الطلب' },
      { name: 'كاش 50', price: 'السعر حسب الطلب' },
      { name: 'Pool Pass', price: 'السعر حسب الطلب' }
    ] 
  }
];

var gamesData = defaultGamesData;
var selectedGame = null;

function renderGames() {
  var container = document.getElementById('gamesGrid');
  if (!container) return;
  container.innerHTML = '';
  
  gamesData.forEach(function(game) {
    var div = document.createElement('div');
    div.className = 'game-item';
    div.innerHTML = '<span class="game-name">' + game.name + '</span>';
    div.onclick = function() {
      selectGame(game, div);
    };
    container.appendChild(div);
  });
}

function selectGame(game, element) {
  selectedGame = game;
  document.querySelectorAll('.game-item').forEach(function(el) {
    el.classList.remove('active');
  });
  element.classList.add('active');

  var packageSelect = document.getElementById('packageSelect');
  packageSelect.innerHTML = '<option value="">-- اختر الباقة --</option>';
  
  game.packages.forEach(function(pkg) {
    var opt = document.createElement('option');
    opt.value = pkg.name + ' (' + pkg.price + ')';
    opt.innerText = pkg.name + ' - ' + pkg.price;
    packageSelect.appendChild(opt);
  });
}

async function submitOrder() {
  var userId = document.getElementById('userId').value.trim();
  var packageVal = document.getElementById('packageSelect').value;
  var paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  var senderInfo = document.getElementById('senderInfo').value.trim();
  var fileInput = document.getElementById('receiptImage');
  var btn = document.getElementById('submitBtn');

  if (!selectedGame) { alert('الرجاء اختيار اللعبة أولاً!'); return; }
  if (!userId) { alert('الرجاء إدخال ID اللعبة!'); return; }
  if (!packageVal) { alert('الرجاء اختيار الباقة المراد شحنها!'); return; }
  if (!senderInfo) { alert('الرجاء إدخال رقم العملية!'); return; }

  var imageUrl = "لا توجد صورة مرفقة";

  if (fileInput.files.length > 0) {
    btn.innerText = "جاري رفع الصورة والطلب...";
    btn.disabled = true;

    var formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
      var response = await fetch("https://api.imgbb.com/1/upload?key=" + IMGBB_API_KEY, {
        method: "POST",
        body: formData
      });
      var data = await response.json();
      if (data.success) {
        imageUrl = data.data.url;
      }
    } catch (error) {
      console.error("فشل رفع الصورة:", error);
    }
  }

  btn.innerText = "تأكيد وإرسال عبر الواتساب 📲";
  btn.disabled = false;

  var newOrder = {
    id: Date.now(),
    date: new Date().toLocaleString('ar-EG'),
    game: selectedGame.name,
    userId: userId,
    package: packageVal,
    payment: paymentMethod,
    senderInfo: senderInfo,
    imageUrl: imageUrl
  };

  saveOrderToStorage(newOrder);

  var whatsappMessage = "*طلب شحن جديد من زيكو ستور 🎮*%0A%0A" +
    "🎮 *اللعبة:* " + newOrder.game + "%0A" +
    "🆔 *المعرف (ID):* " + newOrder.userId + "%0A" +
    "💎 *الباقة:* " + newOrder.package + "%0A" +
    "💳 *طريقة الدفع:* " + newOrder.payment + "%0A" +
    "🔢 *رقم العملية:* " + newOrder.senderInfo + "%0A" +
    "🖼️ *صورة الإشعار:* " + newOrder.imageUrl + "%0A" +
    "📅 *التاريخ:* " + newOrder.date;

  var whatsappUrl = "https://wa.me/" + MY_PHONE_NUMBER + "?text=" + whatsappMessage;
  window.open(whatsappUrl, '_blank');
}

function loginAdmin() {
  var inputPass = document.getElementById('adminPassInput').value;
  if (inputPass === ADMIN_PASSWORD) {
    document.getElementById('adminAuth').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
    loadAdminGames();
    loadOrdersFromStorage();
  } else {
    alert('كلمة السر غير صحيحة!');
  }
}

function logoutAdmin() {
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminAuth').classList.remove('hidden');
  document.getElementById('adminContent').classList.add('hidden');
}

function loadAdminGames() {
  var adminGameSelect = document.getElementById('adminGameSelect');
  adminGameSelect.innerHTML = '';
  gamesData.forEach(function(game, index) {
    var opt = document.createElement('option');
    opt.value = index;
    opt.innerText = game.name;
    adminGameSelect.appendChild(opt);
  });
  loadAdminPackages();
}

function loadAdminPackages() {
  var gameIndex = document.getElementById('adminGameSelect').value;
  var adminPackageSelect = document.getElementById('adminPackageSelect');
  adminPackageSelect.innerHTML = '';
  
  if (gameIndex !== '' && gamesData[gameIndex]) {
    gamesData[gameIndex].packages.forEach(function(pkg, index) {
      var opt = document.createElement('option');
      opt.value = index;
      opt.innerText = pkg.name + ' (' + pkg.price + ')';
      adminPackageSelect.appendChild(opt);
    });
  }
}

function updatePrice() {
  var gameIndex = document.getElementById('adminGameSelect').value;
  var pkgIndex = document.getElementById('adminPackageSelect').value;
  var newPrice = document.getElementById('adminPriceInput').value.trim();

  if (!newPrice) {
    alert('الرجاء إدخال السعر الجديد!');
    return;
  }

  gamesData[gameIndex].packages[pkgIndex].price = newPrice;
  localStorage.setItem('ziko_games_data', JSON.stringify(gamesData));
  
  alert('تم تحديث السعر بنجاح!');
  document.getElementById('adminPriceInput').value = '';
  loadAdminPackages();
  renderGames();
}

function saveOrderToStorage(order) {
  var orders = JSON.parse(localStorage.getItem('ziko_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('ziko_orders', JSON.stringify(orders));
  if (!document.getElementById('adminContent').classList.contains('hidden')) {
    loadOrdersFromStorage();
  }
}

function loadOrdersFromStorage() {
  var orders = JSON.parse(localStorage.getItem('ziko_orders')) || [];
  var tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#888;">لا يوجد سجلات عملاء حتى الآن</td></tr>';
    return;
  }

  orders.forEach(function(ord, index) {
    var tr = document.createElement('tr');
    var imageDisplay = ord.imageUrl.startsWith('http') 
      ? '<a href="' + ord.imageUrl + '" target="_blank" style="color:#00f2fe;">عرض الصورة 📸</a>' 
      : 'لا توجد';

    tr.innerHTML = '<td>' + (index + 1) + '</td>' +
      '<td>' + ord.date + '</td>' +
      '<td>' + ord.game + '</td>' +
      '<td><b style="color:#00f2fe;">' + ord.userId + '</b></td>' +
      '<td>' + ord.package + '</td>' +
      '<td>' + ord.payment + '</td>' +
      '<td>' + ord.senderInfo + '</td>' +
      '<td>' + imageDisplay + '</td>' +
      '<td><button onclick="deleteOrder(' + ord.id + ')" style="background:#ff0055; color:#fff; border:none; border-radius:4px; cursor:pointer; padding:3px 8px;">حذف</button></td>';
    tbody.appendChild(tr);
  });
}

function deleteOrder(id) {
  var orders = JSON.parse(localStorage.getItem('ziko_orders')) || [];
  orders = orders.filter(function(order) { return order.id !== id; });
  localStorage.setItem('ziko_orders', JSON.stringify(orders));
  loadOrdersFromStorage();
}

function clearOrders() {
  if (confirm("هل أنت تأكد من مسح جميع سجلات العملاء؟")) {
    localStorage.removeItem('ziko_orders');
    loadOrdersFromStorage();
  }
}

renderGames();
