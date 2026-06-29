// TreeHole Anonymous Message Platform
class TreeHoleApp {
    constructor() {
        this.messages = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.likedMessages = new Set();
        this.messageIdCounter = 1;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSampleMessages();
    }

    initializeElements() {
        // Form elements
        this.messageForm = document.getElementById('messageForm');
        this.messageTextarea = document.getElementById('messageText');
        this.charCount = document.getElementById('charCount');
        this.categorySelect = document.getElementById('category');
        
        // Message display elements
        this.messagesContainer = document.getElementById('messagesContainer');
        this.filterCategory = document.getElementById('filterCategory');
        this.searchInput = document.getElementById('searchInput');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Modal
        this.modal = document.getElementById('successModal');
        this.modalCloseBtn = document.querySelector('.modal-close-btn');
        
        // Remove sample message
        const sampleMessage = document.querySelector('.sample');
        if (sampleMessage) {
            sampleMessage.remove();
        }
    }

    bindEvents() {
        // Form submission
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Character count
        this.messageTextarea.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value.length);
        });

        // Filter change
        this.filterCategory.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderMessages();
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderMessages();
        });

        // Load more
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMoreMessages();
        });

        // Modal close
        this.modalCloseBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    updateCharCount(count) {
        this.charCount.textContent = count;
        if (count > 450) {
            this.charCount.style.color = '#ef4444';
        } else if (count > 400) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '#9ca3af';
        }
    }

    handleSubmit() {
        const messageText = this.messageTextarea.value.trim();
        const category = this.categorySelect.value;

        if (!messageText) return;

        const newMessage = {
            id: this.messageIdCounter++,
            text: messageText,
            category: category || null,
            timestamp: new Date(),
            likes: 0,
            comments: Math.floor(Math.random() * 10)
        };

        this.messages.unshift(newMessage);
        this.renderMessages();
        this.resetForm();
        this.showModal();
    }

    resetForm() {
        this.messageForm.reset();
        this.updateCharCount(0);
    }

    showModal() {
        this.modal.classList.add('show');
        setTimeout(() => {
            this.hideModal();
        }, 3000);
    }

    hideModal() {
        this.modal.classList.remove('show');
    }

    loadSampleMessages() {
        const sampleMessages = [
            {
                id: this.messageIdCounter++,
                text: "今天终于鼓起勇气向喜欢的人表白了，虽然被拒绝了，但至少没有遗憾。谢谢你，让我变得勇敢。",
                category: 'confession',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                likes: 23,
                comments: 5
            },
            {
                id: this.messageIdCounter++,
                text: "工作压力大，每天都想辞职。但想到家人的期待，又只能咬牙坚持。希望明天会更好吧。",
                category: 'complaint',
                timestamp: new Date(Date.now() - 1000 * 60 * 15),
                likes: 67,
                comments: 12
            },
            {
                id: this.messageIdCounter++,
                text: "其实我一直都在假装很快乐，只有自己知道内心有多孤独。害怕被看穿，所以学会了戴面具生活。",
                category: 'secret',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                likes: 156,
                comments: 23
            },
            {
                id: this.messageIdCounter++,
                text: "我想环游世界，看看这个世界的美好。虽然现在还在为了梦想努力，但相信总有一天会实现的。",
                category: 'dream',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                likes: 89,
                comments: 8
            },
            {
                id: this.messageIdCounter++,
                text: "最遗憾的事情，就是没有在爷爷还在的时候多陪陪他。现在说再多对不起都来不及了...",
                category: 'regret',
                timestamp: new Date(Date.now() - 1000 * 60 * 120),
                likes: 234,
                comments: 31
            },
            {
                id: this.messageIdCounter++,
                text: "感谢那些在我最困难时期帮助过我的人，是你们让我重新找到了生活的希望和勇气。",
                category: 'gratitude',
                timestamp: new Date(Date.now() - 1000 * 60 * 180),
                likes: 178,
                comments: 15
            }
        ];

        this.messages = sampleMessages;
        this.renderMessages();
    }

    filterMessages() {
        let filtered = [...this.messages];

        // Category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(msg => msg.category === this.currentFilter);
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(msg => 
                msg.text.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    renderMessages() {
        const filteredMessages = this.filterMessages();
        
        if (filteredMessages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>暂没有找到相关的心声</p>
                </div>
            `;
            return;
        }

        const messagesHTML = filteredMessages.map(message => this.createMessageCard(message)).join('');
        this.messagesContainer.innerHTML = messagesHTML;

        // Bind action button events
        this.bindMessageActions();
    }

    createMessageCard(message) {
        const timeAgo = this.getTimeAgo(message.timestamp);
        const categoryClass = message.category || '';
        const categoryText = this.getCategoryText(message.category);
        const isLiked = this.likedMessages.has(message.id);

        return `
            <div class="message-card" data-message-id="${message.id}">
                <div class="message-header">
                    <span class="message-time">${timeAgo}</span>
                    ${categoryText ? `<span class="message-category ${categoryClass}">${categoryText}</span>` : ''}
                </div>
                <div class="message-content">${this.escapeHtml(message.text)}</div>
                <div class="message-actions">
                    <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-message-id="${message.id}">
                        <i class="fas fa-heart"></i>
                        <span class="count">${message.likes}</span>
                    </button>
                    <button class="action-btn comment-btn" data-message-id="${message.id}">
                        <i class="fas fa-comment"></i>
                        <span class="count">${message.comments}</span>
                    </button>
                </div>
            </div>
        `;
    }

    bindMessageActions() {
        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = parseInt(btn.dataset.messageId);
                this.toggleLike(messageId);
            });
        });

        // Comment buttons (placeholder)
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showToast('评论功能即将上线');
            });
        });
    }

    toggleLike(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        const likeBtn = document.querySelector(`.like-btn[data-message-id="${messageId}"]`);
        
        if (!message || !likeBtn) return;

        if (this.likedMessages.has(messageId)) {
            this.likedMessages.delete(messageId);
            message.likes--;
            likeBtn.classList.remove('liked');
        } else {
            this.likedMessages.add(messageId);
            message.likes++;
            likeBtn.classList.add('liked');
        }

        // Update like count display
        const countSpan = likeBtn.querySelector('.count');
        countSpan.textContent = message.likes;

        // Animate the heart icon
        const heartIcon = likeBtn.querySelector('i');
        heartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            heartIcon.style.transform = 'scale(1)';
        }, 200);
    }

    loadMoreMessages() {
        // Generate more random messages
        const randomMessages = [
            "有些话说不出口，但在这里我终于可以说了。",
            "生活虽然很苦，但还是要继续向前看。",
            "每个人都有自己的故事，只是不为人知罢了。",
            "感谢这个树洞，让我有了倾诉的地方。",
            "希望看到这条消息的人都能过得幸福。",
            "今天也是努力生活的一天呢。"
        ];

        const categories = ['confession', 'complaint', 'secret', 'dream', 'regret', 'gratitude'];
        
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * randomMessages.length);
            const randomCategory = Math.random() > 0.3 ? 
                categories[Math.floor(Math.random() * categories.length)] : null;

            const newMessage = {
                id: this.messageIdCounter++,
                text: randomMessages[randomIndex],
                category: randomCategory,
                timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20)
            };

            this.messages.push(newMessage);
        }

        this.renderMessages();
        
        // Show loading animation
        this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        setTimeout(() => {
            this.loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> 加载更多';
        }, 500);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        return '一周前';
    }

    getCategoryText(category) {
        const categories = {
            'confession': '表白',
            'complaint': '吐槽',
            'secret': '秘密',
            'dream': '梦想',
            'regret': '遗憾',
            'gratitude': '感谢'
        };
        return categories[category] || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-primary);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInUp 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TreeHoleApp();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form when textarea is focused
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id === 'messageText') {
                document.getElementById('messageForm').dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('successModal');
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        }
    });

    // Add parallax effect to background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body::before');
        if (parallax) {
            const speed = 0.5;
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
});