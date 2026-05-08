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
            <div class="logo"><a href="${prefix}index.html">IMAR</a></div>
            <ul>
                <li><a href="${prefix}index.html#writing" class="nav-highlight">文章作成</a></li>
                <li><a href="${prefix}index.html#tools" class="nav-highlight">促進ツール</a></li>
                <li><a href="${prefix}index.html#development">開発</a></li>
                <li><a href="${prefix}about.html">About</a></li>
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
