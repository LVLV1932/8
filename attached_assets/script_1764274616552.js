document.addEventListener('DOMContentLoaded', () => {

    // Dark/Light Mode Toggle
    const modeToggleBtn = document.getElementById('mode-toggle');
    const body = document.body;

    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
        body.classList.add(savedMode);
        if (modeToggleBtn) {
            modeToggleBtn.innerHTML = savedMode === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    if (modeToggleBtn) {
        modeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            localStorage.setItem('mode', isDarkMode ? 'dark-mode' : 'light-mode');
            modeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Navigation Function
    window.navigateTo = function(url) {
        window.location.href = url;
    }

    // Dynamic Content Management using LocalStorage

    // --- Data Storage and Retrieval ---
    function getStoredData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
    function saveStoredData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // --- Teachers ---
    const teachersList = document.getElementById('teachers-list');
    function getTeachers() {
        const teachers = getStoredData('teachers');
        if (teachers.length === 0) {
            const defaultTeachers = [
                { id: 1, name: '', position: ' ', bio: '', image: 'images/teacher1.jpg', isDirector: true },
                { id: 2, name: '', position: '', bio: '', image: 'images/teacher2.jpg', isDirector: false },
                { id: 3, name: '', position: '', bio: '', image: 'images/teacher3.jpg', isDirector: false },
            ];
            saveStoredData('teachers', defaultTeachers);
            return defaultTeachers;
        }
        return teachers.sort((a, b) => (b.isDirector ? 1 : 0) - (a.isDirector ? 1 : 0));
    }

    function renderTeachers() {
        if (!teachersList) return;
        const teachers = getTeachers();
        teachersList.innerHTML = '';
        teachers.forEach(teacher => {
            const teacherCard = document.createElement('div');
            teacherCard.classList.add('teacher-card');
            teacherCard.innerHTML = `
                <img src="${teacher.image}" alt="صورة ${teacher.name}">
                <h4>${teacher.name}</h4>
                <p>${teacher.position}</p>
                <p class="bio">${teacher.bio}</p>
            `;
            teachersList.appendChild(teacherCard);
        });
    }

    // --- Articles ---
    const articlesList = document.getElementById('articles-list');
    function getArticles() {
        return getStoredData('articles');
    }
    function renderArticles() {
        if (!articlesList) return;
        const articles = getArticles();
        articlesList.innerHTML = '';
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.classList.add('article-card');
            articleCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}">
                <h4>${article.title}</h4>
                <p>${article.content.substring(0, 100)}...</p>
                <a href="article.html?id=${article.id}" class="btn secondary-btn">اقرأ المزيد</a>
            `;
            articlesList.appendChild(articleCard);
        });
    }

    // Function to render single article page
    function renderSingleArticle() {
        const articleContainer = document.getElementById('article-content-container');
        if (!articleContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        const articles = getArticles();
        const article = articles.find(art => art.id == articleId);

        if (article) {
            articleContainer.innerHTML = `
                <h2>${article.title}</h2>
                <img src="${article.image}" alt="${article.title}" class="article-image-full">
                <p>${article.content}</p>
            `;
            document.title = article.title;
        } else {
            articleContainer.innerHTML = `
                <h2>المقال غير موجود.</h2>
                <p>عذراً، لم يتم العثور على المقال الذي تبحث عنه.</p>
            `;
        }
    }


    // --- Images ---
    const galleryGrid = document.getElementById('gallery-grid');
    function getImages() {
        return getStoredData('images');
    }
    function renderGallery() {
        if (!galleryGrid) return;
        const images = getImages();
        galleryGrid.innerHTML = '';
        images.forEach(img => {
            const imgElement = document.createElement('div');
            imgElement.classList.add('gallery-item');
            imgElement.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
                <p>${img.alt}</p>
            `;
            galleryGrid.appendChild(imgElement);
        });
    }

    // --- Admin Panel Functions ---
    const adminMain = document.querySelector('.admin-main');
    if (adminMain) {
        const tabs = document.querySelectorAll('.admin-tabs .tab-btn');
        const tabPanes = document.querySelectorAll('.admin-content .tab-pane');
        const modal = document.getElementById('edit-modal');
        const closeModalBtn = document.querySelector('.close-modal');

        let currentEditItem = null;

        // Open/Close Modal
        function openModal() {
            if (modal) {
                modal.style.display = 'flex';
            }
        }
        function closeModal() {
            if (modal) {
                modal.style.display = 'none';
            }
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === target) {
                        pane.classList.add('active');
                    }
                });
            });
        });

        // Image Management
        const addImageForm = document.getElementById('add-image-form');
        const adminImageList = document.getElementById('admin-image-list');
        const editImageForm = document.getElementById('edit-image-form');

        function renderAdminImages() {
            const images = getImages();
            if (adminImageList) {
                adminImageList.innerHTML = '';
                images.forEach(img => {
                    const item = document.createElement('div');
                    item.classList.add('content-item');
                    item.innerHTML = `
                        <img src="${img.src}" alt="${img.alt}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                        <span>${img.alt}</span>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${img.id}" data-type="image"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${img.id}" data-type="image"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    adminImageList.appendChild(item);
                });
            }
        }

        if (addImageForm) {
            addImageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const file = document.getElementById('image-file').files[0];
                const alt = document.getElementById('image-alt').value;
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newImage = {
                            id: Date.now(),
                            src: event.target.result,
                            alt: alt
                        };
                        const images = getImages();
                        images.push(newImage);
                        saveStoredData('images', images);
                        renderAdminImages();
                        renderGallery();
                        addImageForm.reset();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (editImageForm) {
            editImageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newAlt = document.getElementById('edit-image-alt').value;
                const newFile = document.getElementById('edit-image-file').files[0];
                let images = getImages();
                const index = images.findIndex(img => img.id == currentEditItem.id);

                if (index !== -1) {
                    images[index].alt = newAlt;
                    if (newFile) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            images[index].src = event.target.result;
                            saveStoredData('images', images);
                            renderAdminImages();
                            renderGallery();
                            closeModal();
                        };
                        reader.readAsDataURL(newFile);
                    } else {
                        saveStoredData('images', images);
                        renderAdminImages();
                        renderGallery();
                        closeModal();
                    }
                }
            });
        }

        // Article Management
        const addArticleForm = document.getElementById('add-article-form');
        const adminArticlesList = document.getElementById('admin-articles-list');
        const editArticleForm = document.getElementById('edit-article-form');

        function renderAdminArticles() {
            const articles = getArticles();
            if (adminArticlesList) {
                adminArticlesList.innerHTML = '';
                articles.forEach(article => {
                    const item = document.createElement('div');
                    item.classList.add('content-item');
                    item.innerHTML = `
                        <img src="${article.image}" alt="${article.title}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                        <span>${article.title}</span>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${article.id}" data-type="article"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${article.id}" data-type="article"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    adminArticlesList.appendChild(item);
                });
            }
        }

        if (addArticleForm) {
            addArticleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('article-title').value;
                const content = document.getElementById('article-content').value;
                const imageFile = document.getElementById('article-image').files[0];

                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newArticle = {
                            id: Date.now(),
                            title,
                            content,
                            image: event.target.result
                        };
                        const articles = getArticles();
                        articles.push(newArticle);
                        saveStoredData('articles', articles);
                        renderAdminArticles();
                        renderArticles();
                        addArticleForm.reset();
                    };
                    reader.readAsDataURL(imageFile);
                }
            });
        }

        if (editArticleForm) {
            editArticleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newTitle = document.getElementById('edit-article-title').value;
                const newContent = document.getElementById('edit-article-content').value;
                const newImageFile = document.getElementById('edit-article-image').files[0];
                let articles = getArticles();
                const index = articles.findIndex(art => art.id == currentEditItem.id);

                if (index !== -1) {
                    articles[index].title = newTitle;
                    articles[index].content = newContent;

                    if (newImageFile) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            articles[index].image = event.target.result;
                            saveStoredData('articles', articles);
                            renderAdminArticles();
                            renderArticles();
                            closeModal();
                        };
                        reader.readAsDataURL(newImageFile);
                    } else {
                        saveStoredData('articles', articles);
                        renderAdminArticles();
                        renderArticles();
                        closeModal();
                    }
                }
            });
        }


        // Teacher Management
        const addTeacherForm = document.getElementById('add-teacher-form');
        const adminTeachersList = document.getElementById('admin-teachers-list');
        const editTeacherForm = document.getElementById('edit-teacher-form');

        function renderAdminTeachers() {
            const teachers = getTeachers();
            if (adminTeachersList) {
                adminTeachersList.innerHTML = '';
                teachers.forEach(teacher => {
                    const item = document.createElement('div');
                    item.classList.add('content-item');
                    item.innerHTML = `
                        <img src="${teacher.image}" alt="صورة ${teacher.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                        <span>${teacher.name} - ${teacher.position}</span>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${teacher.id}" data-type="teacher"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${teacher.id}" data-type="teacher"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    adminTeachersList.appendChild(item);
                });
            }
        }

        if (addTeacherForm) {
            addTeacherForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const file = document.getElementById('teacher-image').files[0];
                const name = document.getElementById('teacher-name').value;
                const position = document.getElementById('teacher-position').value;
                const isDirector = document.getElementById('is-director').checked;
                const bio = document.getElementById('teacher-bio').value;

                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newTeacher = {
                            id: Date.now(),
                            name,
                            position,
                            bio,
                            image: event.target.result,
                            isDirector
                        };
                        const teachers = getTeachers();
                        if (isDirector) {
                            teachers.forEach(t => t.isDirector = false);
                            teachers.unshift(newTeacher);
                        } else {
                            teachers.push(newTeacher);
                        }
                        saveStoredData('teachers', teachers);
                        renderAdminTeachers();
                        renderTeachers();
                        addTeacherForm.reset();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (editTeacherForm) {
            editTeacherForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = document.getElementById('edit-teacher-name').value;
                const newPosition = document.getElementById('edit-teacher-position').value;
                const newBio = document.getElementById('edit-teacher-bio').value;
                const newImageFile = document.getElementById('edit-teacher-image').files[0];
                const newIsDirector = document.getElementById('edit-is-director').checked;
                let teachers = getTeachers();
                const index = teachers.findIndex(t => t.id == currentEditItem.id);

                if (index !== -1) {
                    teachers[index].name = newName;
                    teachers[index].position = newPosition;
                    teachers[index].bio = newBio;
                    
                    if (newIsDirector) {
                        teachers.forEach(t => t.isDirector = false);
                        teachers[index].isDirector = true;
                    } else {
                        teachers[index].isDirector = false;
                    }

                    if (newImageFile) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            teachers[index].image = event.target.result;
                            saveStoredData('teachers', teachers);
                            renderAdminTeachers();
                            renderTeachers();
                            closeModal();
                        };
                        reader.readAsDataURL(newImageFile);
                    } else {
                        saveStoredData('teachers', teachers);
                        renderAdminTeachers();
                        renderTeachers();
                        closeModal();
                    }
                }
            });
        }


        // Main Event Listeners for Edit and Delete
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn');
            if (btn) {
                const id = btn.dataset.id;
                const type = btn.dataset.type;
                if (type === 'image') {
                    let images = getImages().filter(item => item.id != id);
                    saveStoredData('images', images);
                    renderAdminImages();
                    renderGallery();
                } else if (type === 'article') {
                    let articles = getArticles().filter(item => item.id != id);
                    saveStoredData('articles', articles);
                    renderAdminArticles();
                    renderArticles();
                } else if (type === 'teacher') {
                    let teachers = getTeachers().filter(item => item.id != id);
                    saveStoredData('teachers', teachers);
                    renderAdminTeachers();
                    renderTeachers();
                }
            }
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.edit-btn');
            if (btn) {
                const id = btn.dataset.id;
                const type = btn.dataset.type;
                let data;

                if (document.getElementById('edit-image-form')) document.getElementById('edit-image-form').style.display = 'none';
                if (document.getElementById('edit-article-form')) document.getElementById('edit-article-form').style.display = 'none';
                if (document.getElementById('edit-teacher-form')) document.getElementById('edit-teacher-form').style.display = 'none';

                if (type === 'image') {
                    data = getImages().find(item => item.id == id);
                    currentEditItem = data;
                    if (document.getElementById('edit-image-alt')) document.getElementById('edit-image-alt').value = data.alt;
                    if (document.getElementById('edit-image-preview')) document.getElementById('edit-image-preview').src = data.src;
                    if (document.getElementById('edit-image-form')) document.getElementById('edit-image-form').style.display = 'block';
                } else if (type === 'article') {
                    data = getArticles().find(item => item.id == id);
                    currentEditItem = data;
                    if (document.getElementById('edit-article-title')) document.getElementById('edit-article-title').value = data.title;
                    if (document.getElementById('edit-article-content')) document.getElementById('edit-article-content').value = data.content;
                    if (document.getElementById('edit-article-preview')) document.getElementById('edit-article-preview').src = data.image;
                    if (document.getElementById('edit-article-form')) document.getElementById('edit-article-form').style.display = 'block';
                } else if (type === 'teacher') {
                    data = getTeachers().find(item => item.id == id);
                    currentEditItem = data;
                    if (document.getElementById('edit-teacher-name')) document.getElementById('edit-teacher-name').value = data.name;
                    if (document.getElementById('edit-teacher-position')) document.getElementById('edit-teacher-position').value = data.position;
                    if (document.getElementById('edit-teacher-bio')) document.getElementById('edit-teacher-bio').value = data.bio;
                    if (document.getElementById('edit-teacher-preview')) document.getElementById('edit-teacher-preview').src = data.image;
                    if (document.getElementById('edit-is-director')) document.getElementById('edit-is-director').checked = data.isDirector;
                    if (document.getElementById('edit-teacher-form')) document.getElementById('edit-teacher-form').style.display = 'block';
                }
                openModal();
            }
        });

        if (window.location.pathname.endsWith('admin.html')) {
            renderAdminImages();
            renderAdminArticles();
            renderAdminTeachers();
        }
    }

    // Initial renders for pages
    const path = window.location.pathname.split('/').pop();
    if (path === 'index.html' || path === '') {
        renderGallery();
        renderArticles();
    }
    if (path === 'about.html') {
        renderTeachers();
    }
    if (path === 'article.html') {
        renderSingleArticle();
    }
    if (path === 'teachers.html') {
        renderTeachers();
    }
});