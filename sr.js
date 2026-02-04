class LikeSystem {
            constructor() {
                this.storageKey = 'recipeLikes_v1';
                this.likedRecipes = this.loadLikes();
                this.init();
            }

            // 1. Загружаем лайки из LocalStorage
            loadLikes() {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    try {
                        return JSON.parse(stored);
                    } catch (e) {
                        console.error('Ошибка загрузки лайков:', e);
                        return {};
                    }
                }
                return {};
            }

            // 2. Сохраняем лайки в LocalStorage
            saveLikes() {
                localStorage.setItem(this.storageKey, JSON.stringify(this.likedRecipes));
            }

            // 3. Инициализация при загрузке страницы
            init() {
                // Инициализация всех кнопок
                document.querySelectorAll('.like-btn').forEach(button => {
                    const recipeCard = button.closest('.recipe-card');
                    const recipeId = recipeCard.dataset.id;
                    
                    // Устанавливаем начальное состояние
                    const isLiked = this.likedRecipes[recipeId] === true;
                    if (isLiked) {
                        button.classList.add('active');
                        const counter = button.querySelector('.like-count');
                        if (counter) counter.textContent = '1';
                    }
                    
                    // Добавляем обработчик клика
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleLike(recipeId, button);
                    });
                });
                
                // Обновляем общий счётчик
                this.updateTotalCounter();
            }

            // 4. Основная функция - переключение лайка
            toggleLike(recipeId, button) {
                // Определяем текущее состояние
                const isCurrentlyLiked = this.likedRecipes[recipeId] === true;
                
                // Меняем состояние
                if (isCurrentlyLiked) {
                    // Убираем лайк
                    delete this.likedRecipes[recipeId];
                    button.classList.remove('active');
                } else {
                    // Ставим лайк
                    this.likedRecipes[recipeId] = true;
                    button.classList.add('active');
                }
                
                // Обновляем счётчик на кнопке
                const counter = button.querySelector('.like-count');
                if (counter) {
                    counter.textContent = isCurrentlyLiked ? '0' : '1';
                }
                
                // Сохраняем и обновляем общий счётчик
                this.saveLikes();
                this.updateTotalCounter();
                
                // Отправляем событие (опционально)
                this.dispatchLikeEvent(recipeId, !isCurrentlyLiked);
                
                // Анимация (дополнительно)
                this.animateButton(button);
            }

            // 5. Обновление общего счётчика лайков
            updateTotalCounter() {
                const total = Object.keys(this.likedRecipes).length;
                const totalElement = document.getElementById('total-likes');
                if (totalElement) {
                    totalElement.textContent = total;
                }
            }

            // 6. Анимация кнопки
            animateButton(button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }

            // 7. Событие для других скриптов
            dispatchLikeEvent(recipeId, isLiked) {
                const event = new CustomEvent('recipeLiked', {
                    detail: { recipeId, isLiked }
                });
                document.dispatchEvent(event);
            }

            // 8. Сброс всех лайков
            resetAllLikes() {
                this.likedRecipes = {};
                this.saveLikes();
                
                // Обновляем все кнопки
                document.querySelectorAll('.like-btn').forEach(button => {
                    button.classList.remove('active');
                    const counter = button.querySelector('.like-count');
                    if (counter) counter.textContent = '0';
                });
                
                this.updateTotalCounter();
                console.log('Все лайки сброшены');
            }
        }

        // Создаём экземпляр системы лайков
        const likeSystem = new LikeSystem();

        // Кнопка сброса лайков
        document.getElementById('reset-likes').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все лайки?')) {
                likeSystem.resetAllLikes();
            }
        });

        // Пример использования события
        document.addEventListener('recipeLiked', (e) => {
            console.log(`Лайк изменён! Рецепт: ${e.detail.recipeId}, Новое состояние: ${e.detail.isLiked ? 'лайкнут' : 'не лайкнут'}`);
        });

        // Дополнительно: обрабатываем ошибки
        window.addEventListener('error', (e) => {
            console.error('Ошибка в скрипте:', e.error);
        });

        // Простой дебаг-сообщение
        console.log('Система лайков загружена. Нажмите на сердца!');