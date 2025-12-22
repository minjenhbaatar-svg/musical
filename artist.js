const gallery = document.getElementById('imageGallery');
    const container = document.getElementById('galleryContainer');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length; // 5 зурагтай
    
    // CSS хувьсагчуудтай тааруулж тохируулна
    const slideWidth = 300; 
    const slideMargin = 30;
    const stepSize = slideWidth + slideMargin; // 330px - Нэг алхамны зай

    let currentTranslateX = 0; // Одоогийн шилжилт (px)
    let maxTranslateX; // Хамгийн их хөдлөх зай (баруун хязгаар)

    // Макс хөдлөх зайг тооцоолно
    function calculateMaxTranslateX() {
        const visibleWidth = container.clientWidth; // 990px
        const contentWidth = totalSlides * stepSize - slideMargin; // 5 * 330 - 30 = 1620px
        
        maxTranslateX = -(contentWidth - visibleWidth); // 1620 - 990 = 630 -> -630px
    }
    
    // Эхлэх болон цонхны хэмжээ өөрчлөгдөхөд тооцоолно
    window.addEventListener('resize', calculateMaxTranslateX);
    calculateMaxTranslateX();

    // Сум дарах үйлдлийг гүйцэтгэх функц
    function moveSlide(direction) {
        let newTranslateX = currentTranslateX + (direction * stepSize);

        // Хязгаарлалт хийх
        if (newTranslateX > 0) {
            newTranslateX = 0; // Зүүн хязгаар
        } else if (newTranslateX < maxTranslateX) {
            newTranslateX = maxTranslateX; // Баруун хязгаар
        }

        currentTranslateX = newTranslateX;
        setTranslate(currentTranslateX);
        updateArrows();
    }

    // --- Чирэх (Drag) Функцийг Нэгтгэх ---
    let isDragging = false; 
    let initialX;         
    let startTranslateX; 

    gallery.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        initialX = e.clientX;
        startTranslateX = currentTranslateX; 
        isDragging = true;
        gallery.style.transition = 'none'; // Transition-ийг унтраана
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        gallery.style.transition = 'transform 0.5s ease-in-out'; // Transition-ийг буцааж асаана

        const dragDistance = e.clientX - initialX;
        const newTranslateX = startTranslateX + dragDistance;
        
        // Хамгийн ойрын 'step' (330px) рүү шилжүүлэхийн тулд дугуйлна
        let snappedX = Math.round(newTranslateX / stepSize) * stepSize;
        
        // Хязгаарлалт хийх
        if (snappedX > 0) snappedX = 0;
        if (snappedX < maxTranslateX) snappedX = maxTranslateX;
        
        currentTranslateX = snappedX;
        setTranslate(currentTranslateX);
        updateArrows();
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const dragDistance = e.clientX - initialX;
        let finalTranslateX = startTranslateX + dragDistance;
        
        // Хязгаараас хэтэрсэн ч бага зэрэг хөдлөхийг зөвшөөрнө (Elastic effect)
        if (finalTranslateX > 50) finalTranslateX = 50; 
        if (finalTranslateX < maxTranslateX - 50) finalTranslateX = maxTranslateX - 50;

        setTranslate(finalTranslateX);
    }

    function setTranslate(xPos) {
        gallery.style.transform = "translateX(" + xPos + "px)";
    }
    
    // Сумны идэвхийг шалгах функц (Нэмэлт)
    function updateArrows() {
        document.querySelector('.prev').disabled = currentTranslateX === 0;
        document.querySelector('.next').disabled = currentTranslateX <= maxTranslateX;
    }
    
    // Эхлэх үед сумны төлөвийг шалгана
    updateArrows();
    