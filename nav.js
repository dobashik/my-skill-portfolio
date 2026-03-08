/**
 * Shared Navigation - 全ページ共通ナビゲーション
 * このファイルを修正すると全ページのナビゲーションに反映されます。
 */
(function () {
    // ページの相対パスを検出
    const path = window.location.pathname;
    let prefix = '';

    if (path.includes('/consulting/') || path.includes('/ai-services/')) {
        prefix = '../';
    }

    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <div class="logo"><a href="${prefix}index.html">IMARCA</a></div>
            <ul>
                <li><a href="${prefix}ai-services.html" class="nav-highlight">プロジェクト</a></li>
                <li><a href="${prefix}consulting/ai-consulting.html" class="nav-highlight">AIコンサルティング</a></li>
                <li><a href="${prefix}index.html#about">About</a></li>
                <li><a href="${prefix}portfolio.html">ポートフォリオ</a></li>
                <li><a href="${prefix}index.html#contact">Contact</a></li>
            </ul>
        </nav>
    `;

    // 既存のheaderがあれば置き換え、なければbodyの先頭に挿入
    const existingHeader = document.querySelector('header');
    if (existingHeader) {
        existingHeader.replaceWith(header);
    } else {
        // cursor-outlineの後に挿入
        const cursorOutline = document.querySelector('.cursor-outline');
        if (cursorOutline) {
            cursorOutline.after(header);
        } else {
            document.body.prepend(header);
        }
    }
})();
