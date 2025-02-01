//function toggleSidebar() {
//    const sidebar = document.getElementById('sidebar');
//    const mainContent = document.querySelector('.main-content');
//    const toggleBtn = document.getElementById('toggle-btn');
//
//    if (sidebar && mainContent && toggleBtn) {
//        sidebar.classList.toggle('hidden'); // 切换侧边栏的隐藏状态
//        mainContent.classList.toggle('hidden-sidebar'); // 切换主内容区域的布局
//        toggleBtn.classList.toggle('hidden'); // 切换按钮的位置
//        toggleBtn.textContent = sidebar.classList.contains('hidden') ? '展开' : '收起'; // 切换按钮的文字
//    } else {
//        console.error('Sidebar, main content, or toggle button element not found');
//    }
//}
//
//// 初始化按钮状态
//window.addEventListener('DOMContentLoaded', () => {
//    const sidebar = document.getElementById('sidebar');
//    const toggleBtn = document.getElementById('toggle-btn');
//
//    if (sidebar && toggleBtn) {
//        if (sidebar.classList.contains('hidden')) {
//            toggleBtn.classList.add('hidden');
//            toggleBtn.textContent = '展开';
//        } else {
//            toggleBtn.classList.remove('hidden');
//            toggleBtn.textContent = '收起';
//        }
//    }
//});
//
//// 监听窗口大小变化，动态调整侧边栏的显示状态
//window.addEventListener('resize', () => {
//    const sidebar = document.getElementById('sidebar');
//    const mainContent = document.querySelector('.main-content');
//    const toggleBtn = document.getElementById('toggle-btn');
//
//    if (sidebar && mainContent) {
//        if (window.innerWidth < 768) {
//            sidebar.classList.add('hidden');
//            mainContent.classList.add('hidden-sidebar');
//            toggleBtn.classList.add('hidden');
//            toggleBtn.textContent = '展开';
//        } else {
//            sidebar.classList.remove('hidden');
//            mainContent.classList.remove('hidden-sidebar');
//            toggleBtn.classList.remove('hidden');
//            toggleBtn.textContent = '收起';
//        }
//    }
//});
//
//// 初始化侧边栏状态
//window.addEventListener('DOMContentLoaded', () => {
//    const sidebar = document.getElementById('sidebar');
//    const mainContent = document.querySelector('.main-content');
//    const toggleBtn = document.getElementById('toggle-btn');
//
//    if (sidebar && mainContent) {
//        if (window.innerWidth < 768) {
//            sidebar.classList.add('hidden');
//            mainContent.classList.add('hidden-sidebar');
//            toggleBtn.classList.add('hidden');
//            toggleBtn.textContent = '展开';
//        }
//    }
//});


let sortStates = [false, false, false, false, false]; // false表示升序，true表示降序
let globalGoodsData;


// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 请求同目录下的 JSON 文件
    fetch('goods_data.json')
        .then(response => response.json()) // 解析 JSON 数据
        .then(data => {

            // 将解析后的数据存储到全局变量中
            globalGoodsData = data;
            // 获取 tbody 元素
            const tbody = document.querySelector('.goods-table tbody');

            // 遍历 JSON 数据，动态生成表格行
            data.forEach(item => {
                const row = document.createElement('tr'); // 创建表格行

                // 遍历 JSON 对象的每个属性，创建表格单元格
                for (const key in item) {
                    const cell = document.createElement('td');
                    cell.textContent = item[key];
                    row.appendChild(cell);
                }

                // 将表格行添加到 tbody 中
                tbody.appendChild(row);
            });
            // 初始化筛选功能
            initFiltering(data);
        })
        .catch(error => {
            console.error('加载 JSON 数据失败:', error);
        });
});


// 初始化筛选功能
function initFiltering(data) {
    const clubSelect = document.getElementById('club-name');
    const goodsSelect = document.getElementById('goods-info');
    const tbody = document.querySelector('.goods-table tbody');

    // 监听社团下拉菜单的变化
    clubSelect.addEventListener('change', () => {
        filterTable(data, clubSelect.value, goodsSelect.value);
    });

    // 监听制品信息下拉菜单的变化
    goodsSelect.addEventListener('change', () => {
        filterTable(data, clubSelect.value, goodsSelect.value);
    });
}

// 根据筛选条件更新表格内容
function filterTable(data, selectedClub, selectedGoods) {
    const tbody = document.querySelector('.goods-table tbody');
    tbody.innerHTML = ''; // 清空表格内容

    data.forEach(item => {
        // 检查是否符合筛选条件
        const matchesClub = selectedClub === 'ALL' || item.社团 === selectedClub;
        const matchesGoods = selectedGoods === 'ALL' || item.制品类型 === selectedGoods;

        if (matchesClub && matchesGoods) {
            const row = document.createElement('tr'); // 创建表格行
            for (const key in item) {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            }
            tbody.appendChild(row); // 将符合条件的行添加到表格中
        }
    });
}


function sortTable(columnIndex) {
    const table = document.getElementById("goods-table");
    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = Array.from(tbody.getElementsByTagName("tr"));

    // 切换排序状态
    sortStates[columnIndex] = !sortStates[columnIndex];

    // 清除所有表头的active类
    const headers = table.getElementsByTagName("th");
    for (let i = 0; i < headers.length; i++) {
        headers[i].classList.remove("active");
    }

    // 设置当前点击的表头为active
    headers[columnIndex].classList.add("active");

    // 根据列内容排序
    rows.sort((a, b) => {
        const cellA = a.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const cellB = b.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        if (sortStates[columnIndex]) {
            return cellB.localeCompare(cellA);
        } else {
            return cellA.localeCompare(cellB);
        }
    });

    // 重新插入排序后的行
    rows.forEach(row => tbody.appendChild(row));
}


function searchTable() {
    const query = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('.goods-table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let found = false;

        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(query)) {
                found = true;
            }
        });

        row.style.display = found ? '' : 'none';
    });
}


function resetAllCondition() {

    // 获取第一个下拉框
    var clubSelect = document.getElementById("club-name");
    // 将其选中项设置为第一个选项（即ALL）
    clubSelect.selectedIndex = 0;

    // 获取第二个下拉框
    var goodsSelect = document.getElementById("goods-info");
    // 将其选中项设置为第一个选项（即ALL）
    goodsSelect.selectedIndex = 0;

    const tbody = document.querySelector('.goods-table tbody');
    tbody.innerHTML = ''; // 清空表格内容

    globalGoodsData.forEach(item => {


        const row = document.createElement('tr'); // 创建表格行
        for (const key in item) {
            const cell = document.createElement('td');
            cell.textContent = item[key];
            row.appendChild(cell);
        }
        tbody.appendChild(row); // 将符合条件的行添加到表格中

    });


    document.getElementById('search').value = "";
    const rows = document.querySelectorAll('.goods-table tbody tr');

    rows.forEach(row => {

        row.style.display = '';
    });
}

var console_note_0 = String("不用看了兄弟, 網頁做的一坨\n如有意可加入新月(沒工資的哦¯\\_(ツ)_/¯)\n")
var console_note_1 = String("新月\n███╗   ██╗███████╗██╗    ██╗███╗   ███╗ ██████╗  ██████╗ ███╗   ██╗\n████╗  ██║██╔════╝██║    ██║████╗ ████║██╔═══██╗██╔═══██╗████╗  ██║\n██╔██╗ ██║█████╗  ██║ █╗ ██║██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║\n██║╚██╗██║██╔══╝  ██║███╗██║██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║\n██║ ╚████║███████╗╚███╔███╔╝██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║\n╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝")
console.log("%s%c%s", console_note_0, "font-weight: bold; color: blue; font-size: 20px", console_note_1);
