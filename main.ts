// main.ts
import { App, Plugin, PluginSettingTab, Setting, MarkdownPostProcessor, MarkdownRenderer, Component } from 'obsidian';

interface CPanelSettings {
    defaultBorderColor: string;
    defaultBorderWidth: string;
    defaultBorderRadius: string;
    defaultBackground: string;
    defaultHeaderBackground: string;
    defaultHeaderTextColor: string;
    defaultHeaderHeight: string;
    defaultCollapsible: boolean;
    defaultCollapsed: boolean;
}

const DEFAULT_SETTINGS: CPanelSettings = {
    defaultBorderColor: '#cccccc',
    defaultBorderWidth: '1px',
    defaultBorderRadius: '8px',
    defaultBackground: '#ffffff',
    defaultHeaderBackground: '#f8f9fa',
    defaultHeaderTextColor: 'var(--text-normal)',
    defaultHeaderHeight: '48px',
    defaultCollapsible: true,
    defaultCollapsed: false
}

export default class CPanelPlugin extends Plugin {
    settings: CPanelSettings;

    async onload() {
        await this.loadSettings();

        // Регистрируем процессор для обработки блоков cpanel
        this.registerMarkdownCodeBlockProcessor('cpanel', this.processCPanelBlock.bind(this));

        // Регистрируем пост-процессор для поддержки разного количества кавычек
        this.registerMarkdownPostProcessor(this.postProcessCPanel.bind(this));

        // Добавляем таб настроек
        this.addSettingTab(new CPanelSettingTab(this.app, this));

        // Добавляем стили
        await this.addStyles();
    }

    onunload() {
        // Удаляем стили при выгрузке плагина
        const styleElement = document.getElementById('cpanel-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    async postProcessCPanel(el: HTMLElement, ctx: any) {
        // Ищем блоки кода cpanel с разным количеством кавычек
        const codeBlocks = el.querySelectorAll('pre > code');
        
        // Используем обычный цикл для совместимости со старыми версиями TypeScript
        for (let i = 0; i < codeBlocks.length; i++) {
            const codeBlock = codeBlocks[i];
            const text = codeBlock.textContent || '';
            
            // Проверяем, начинается ли блок с cpanel
            if (text.startsWith('cpanel\n') || text.startsWith('cpanel ')) {
                const pre = codeBlock.parentElement as HTMLPreElement;
                if (pre && pre.tagName === 'PRE') {
                    // Извлекаем содержимое без первой строки 'cpanel'
                    const lines = text.split('\n');
                    const source = lines.slice(1).join('\n');
                    
                    // Создаем контейнер для панели
                    const container = document.createElement('div');
                    this.createPanel(container, {}, source, ctx);
                    
                    // Заменяем блок кода на панель
                    if (pre.parentNode) {
                        pre.parentNode.replaceChild(container, pre);
                    }
                }
            }
        }
    }

    async processCPanelBlock(source: string, el: HTMLElement, ctx: any) {
        const lines = source.split('\n');
        const config: any = {};
        let contentStart = 0;

        // Парсим конфигурацию
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '---') {
                contentStart = i + 1;
                break;
            }
            if (line.includes(':')) {
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                config[key.trim()] = value;
            }
        }

        // Извлекаем контент
        const content = lines.slice(contentStart).join('\n').trim();

        // Создаем панель
        this.createPanel(el, config, content, ctx);
    }

    createPanel(container: HTMLElement, config: any, content: string, ctx: any) {
        // Получаем настройки с fallback на дефолтные значения
        const title = config.title || 'Custom Panel';
        const icon = config.icon || '';
        const borderColor = config.bordercolor || config.borderColor || this.settings.defaultBorderColor;
        const borderWidth = config.borderwidth || config.borderWidth || this.settings.defaultBorderWidth;
        const borderRadius = config.borderradius || config.borderRadius || this.settings.defaultBorderRadius;
        const background = config.background || this.settings.defaultBackground;
        const headerBackground = config.headerbackground || this.settings.defaultHeaderBackground;
        const headerTextColor = config.headertextcolor || config.headerTextColor || this.settings.defaultHeaderTextColor;
        const headerHeight = config.headerheight || config.headerHeight || this.settings.defaultHeaderHeight;
        const collapsible = config.collapsible !== undefined ? config.collapsible === 'true' : this.settings.defaultCollapsible;
        const collapsed = config.collapsed !== undefined ? config.collapsed === 'true' : this.settings.defaultCollapsed;

        // Создаем основной контейнер панели
        const panel = container.createDiv({
            cls: 'cpanel-container'
        });

        panel.style.border = `${borderWidth} solid ${borderColor}`;
        panel.style.borderRadius = borderRadius;
        panel.style.background = background;
        panel.style.overflow = 'hidden';

        // Создаем заголовок
        const header = panel.createDiv({
            cls: 'cpanel-header'
        });

        header.style.background = headerBackground;
        header.style.color = headerTextColor;
        header.style.height = headerHeight;
        header.style.minHeight = headerHeight;
        header.style.padding = '0 16px';
        header.style.borderBottom = collapsed ? 'none' : `1px solid ${borderColor}`;
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';

        if (collapsible) {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
        }

        // Добавляем иконку если есть
        if (icon) {
            const iconElement = header.createSpan({
                cls: 'cpanel-icon'
            });
            
            // Проверяем, является ли иконка emoji или символом
            if (icon.length <= 2 || /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u.test(icon)) {
                iconElement.textContent = icon;
            } else {
                // Для lucide иконок или других
                iconElement.innerHTML = `<svg class="lucide-icon"><use href="#${icon}"></use></svg>`;
            }
        }

        // Добавляем заголовок
        const titleElement = header.createSpan({
            text: title,
            cls: 'cpanel-title'
        });
        titleElement.style.fontWeight = '600';
        titleElement.style.fontSize = '16px';
        titleElement.style.color = headerTextColor;

        // Добавляем индикатор сворачивания
        let collapseIndicator: HTMLElement | null = null;
        if (collapsible) {
            collapseIndicator = header.createSpan({
                cls: 'cpanel-collapse-indicator'
            });
            collapseIndicator.style.marginLeft = 'auto';
            collapseIndicator.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            collapseIndicator.style.transition = 'transform 0.2s ease';
            collapseIndicator.style.color = headerTextColor;
            collapseIndicator.innerHTML = '▼';
        }

        // Создаем контент
        const contentDiv = panel.createDiv({
            cls: 'cpanel-content'
        });
        contentDiv.style.padding = '16px';
        contentDiv.style.display = collapsed ? 'none' : 'block';

        // Рендерим markdown контент
        if (content) {
            const component = new Component();
            MarkdownRenderer.renderMarkdown(
                content,
                contentDiv,
                ctx.sourcePath || '',
                component
            );
        }

        // Добавляем обработчик клика для сворачивания
        if (collapsible && collapseIndicator) {
            header.addEventListener('click', () => {
                const isCurrentlyCollapsed = contentDiv.style.display === 'none';
                
                if (isCurrentlyCollapsed) {
                    contentDiv.style.display = 'block';
                    collapseIndicator!.style.transform = 'rotate(0deg)';
                    header.style.borderBottom = `1px solid ${borderColor}`;
                } else {
                    contentDiv.style.display = 'none';
                    collapseIndicator!.style.transform = 'rotate(-90deg)';
                    header.style.borderBottom = 'none';
                }
            });
        }
    }

    async addStyles() {
        const defaultStyles = `
            .cpanel-container {
                margin: 16px 0;
                font-family: var(--font-text);
            }

            .cpanel-header {
                transition: background-color 0.2s ease;
            }

            .cpanel-header:hover {
                filter: brightness(0.95);
            }

            .cpanel-icon {
                display: inline-flex;
                align-items: center;
                font-size: 16px;
            }

            .cpanel-title {
                color: var(--text-normal);
            }

            .cpanel-collapse-indicator {
                font-size: 12px;
                color: var(--text-muted);
            }

            .cpanel-content {
                color: var(--text-normal);
            }

            .cpanel-content > *:first-child {
                margin-top: 0;
            }

            .cpanel-content > *:last-child {
                margin-bottom: 0;
            }

            .lucide-icon {
                width: 16px;
                height: 16px;
            }
        `;

        let cssContent = defaultStyles;

        try {
            // Пытаемся загрузить внешний CSS файл
            const cssPath = `.obsidian/plugins/${this.manifest.id}/styles.css`;
            const externalStyles = await this.app.vault.adapter.read(cssPath);
            cssContent = externalStyles;
            console.log('CPanel: Successfully loaded external styles.css');
        } catch (error) {
            console.log('CPanel: External styles.css not found, using default styles');
        }

        // Применяем стили
        const style = document.createElement('style');
        style.textContent = cssContent;
        style.id = 'cpanel-styles';
        document.head.appendChild(style);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class CPanelSettingTab extends PluginSettingTab {
    plugin: CPanelPlugin;

    constructor(app: App, plugin: CPanelPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Custom Panel Settings' });

        // Цвет рамки по умолчанию
        new Setting(containerEl)
            .setName('Default Border Color')
            .setDesc('Default color for panel borders')
            .addText(text => text
                .setPlaceholder('#cccccc')
                .setValue(this.plugin.settings.defaultBorderColor)
                .onChange(async (value) => {
                    this.plugin.settings.defaultBorderColor = value;
                    await this.plugin.saveSettings();
                }));

        // Толщина рамки по умолчанию
        new Setting(containerEl)
            .setName('Default Border Width')
            .setDesc('Default width for panel borders')
            .addText(text => text
                .setPlaceholder('1px')
                .setValue(this.plugin.settings.defaultBorderWidth)
                .onChange(async (value) => {
                    this.plugin.settings.defaultBorderWidth = value;
                    await this.plugin.saveSettings();
                }));

        // Радиус скругления по умолчанию
        new Setting(containerEl)
            .setName('Default Border Radius')
            .setDesc('Default border radius for panels')
            .addText(text => text
                .setPlaceholder('8px')
                .setValue(this.plugin.settings.defaultBorderRadius)
                .onChange(async (value) => {
                    this.plugin.settings.defaultBorderRadius = value;
                    await this.plugin.saveSettings();
                }));

        // Цвет/фон панели по умолчанию
        new Setting(containerEl)
            .setName('Default Panel Background')
            .setDesc('Default background for panel content (supports colors, gradients, images)')
            .addText(text => text
                .setPlaceholder('#ffffff')
                .setValue(this.plugin.settings.defaultBackground)
                .onChange(async (value) => {
                    this.plugin.settings.defaultBackground = value;
                    await this.plugin.saveSettings();
                }));

        // Цвет/фон заголовка по умолчанию
        new Setting(containerEl)
            .setName('Default Header Background')
            .setDesc('Default background for panel headers (supports colors, gradients, images)')
            .addText(text => text
                .setPlaceholder('#f8f9fa')
                .setValue(this.plugin.settings.defaultHeaderBackground)
                .onChange(async (value) => {
                    this.plugin.settings.defaultHeaderBackground = value;
                    await this.plugin.saveSettings();
                }));

        // Цвет текста заголовка по умолчанию
        new Setting(containerEl)
            .setName('Default Header Text Color')
            .setDesc('Default text color for panel headers')
            .addText(text => text
                .setPlaceholder('var(--text-normal)')
                .setValue(this.plugin.settings.defaultHeaderTextColor)
                .onChange(async (value) => {
                    this.plugin.settings.defaultHeaderTextColor = value;
                    await this.plugin.saveSettings();
                }));

        // Высота заголовка по умолчанию
        new Setting(containerEl)
            .setName('Default Header Height')
            .setDesc('Default height for panel headers (e.g., 48px, 3rem, 60px)')
            .addText(text => text
                .setPlaceholder('48px')
                .setValue(this.plugin.settings.defaultHeaderHeight)
                .onChange(async (value) => {
                    this.plugin.settings.defaultHeaderHeight = value;
                    await this.plugin.saveSettings();
                }));

        // Сворачиваемость по умолчанию
        new Setting(containerEl)
            .setName('Default Collapsible')
            .setDesc('Make panels collapsible by default')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.defaultCollapsible)
                .onChange(async (value) => {
                    this.plugin.settings.defaultCollapsible = value;
                    await this.plugin.saveSettings();
                }));

        // Свернутость по умолчанию
        new Setting(containerEl)
            .setName('Default Collapsed State')
            .setDesc('Start panels in collapsed state by default')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.defaultCollapsed)
                .onChange(async (value) => {
                    this.plugin.settings.defaultCollapsed = value;
                    await this.plugin.saveSettings();
                }));
    }
}

